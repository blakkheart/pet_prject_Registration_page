from django.urls import path, include
from api.views import get_routes
from api.views import NoteViewSet
from rest_framework import routers


router = routers.DefaultRouter()
router.register('notes', NoteViewSet, basename='notes')

urlpatterns = [
    path('', include(router.urls)),
    path('routes/', get_routes),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt'))
]
