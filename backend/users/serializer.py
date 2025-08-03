from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import userProfile
from .validator import validateExist

class registerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password','is_active','profile']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.exclude(pk=user_id).filter(email=value).exists():
            raise serializers.ValidationError("Email is already taken.")
        return value
    
    def create(self,validated_data):
        profile = validated_data.pop('profile',None)
        validateExist(username=validated_data['username'],email=validated_data['email'])
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=True,
        )
        userProfile.objects.create(user = user,profile = profile)
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        profile_url = None
        try:
            profile_data = getattr(user, 'profile_data', None)
            if profile_data and getattr(profile_data, 'profile', None):
                request = self.context.get('request')
                if request:
                    profile_url = request.build_absolute_uri(profile_data.profile.url)
                else:
                    profile_url = profile_data.profile.url
        except (AttributeError, ValueError):
            profile_url = None

        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'profile': profile_url,
        }

        return data


class userUpdateSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'email', 'profile']

    def get_profile(self, obj):
        try:
            profile_obj = userProfile.objects.get(user=obj)
            request = self.context.get('request')
            if profile_obj.profile and hasattr(profile_obj.profile, 'url'):
                return request.build_absolute_uri(profile_obj.profile.url)
        except:
            return None
        
    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.exclude(pk=user_id).filter(email=value).exists():
            raise serializers.ValidationError("Email is already taken.")
        return value

    def update(self, instance, validated_data):
        profile_data = self.context['request'].data.get('profile')
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        if profile_data:
            profile_obj, _ = userProfile.objects.get_or_create(user=instance)
            profile_obj.profile = profile_data
            profile_obj.save()

        return instance

    
class adminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','is_active','is_superuser','is_staff']

class adminAddUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Prevents password from being returned in API

    class Meta:
        model = User
        fields = ['id','username', 'email', 'password', 'is_active', 'is_staff', 'is_superuser']
    
    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.exclude(pk=user_id).filter(email=value).exists():
            raise serializers.ValidationError("Email is already taken.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        user.is_staff = validated_data.get('is_staff', False)
        user.is_superuser = validated_data.get('is_superuser', False)
        user.is_active = validated_data.get('is_active', False)
        user.save()
        return user

class adminUpdateSerilaizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','is_active','is_staff','is_superuser']
    
    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if User.objects.exclude(pk=user_id).filter(email=value).exists():
            raise serializers.ValidationError("Email is already taken.")
        return value
    
    