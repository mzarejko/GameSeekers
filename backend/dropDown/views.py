from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from .models import Game, City
from .filter_class import GameFilter
from .serializers import GameSerializer, CitySerializer

class APIGame(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = GameSerializer
    queryset = Game.objects.all()
    filterset_class = GameFilter

class APICity(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CitySerializer
    queryset = City.objects.all()
