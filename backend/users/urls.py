from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, CustomTokenObtainPairView, updateUser
from .admin_views import adminUsers, adminAddUser, adminDeleteUser, adminUpdateUser
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'admin/users', adminUsers, basename='admin_users')
router.register(r'admin/add_user', adminAddUser, basename='admin_add_user')
router.register(r'admin/delete_user', adminDeleteUser, basename='admin_delete_user')
router.register(r'admin/update_user', adminUpdateUser, basename='admin_update_user')

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("update_user/", updateUser.as_view(), name="update_user"),

    path('', include(router.urls)),
]
