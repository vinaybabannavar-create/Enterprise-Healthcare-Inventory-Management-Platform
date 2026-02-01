from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import UserSerializer, RegisterSerializer
from .models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class StaffListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        h_name = getattr(user, 'hospital_name', None)
        print(f"DEBUG: StaffListView called by {user.username} for hospital: {h_name}")
        
        if not h_name:
            print("DEBUG: No hospital_name, returning empty queryset")
            return User.objects.none()
            
        queryset = User.objects.filter(hospital_name__iexact=h_name)
        print(f"DEBUG: Found {queryset.count()} users in hospital '{h_name}'")
        for u in queryset:
            print(f"DEBUG:   - {u.username} ({u.email})")
        return queryset
