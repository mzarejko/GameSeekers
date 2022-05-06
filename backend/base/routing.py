from channels.routing import ProtocolTypeRouter, URLRouter 
from .JWTmiddleware import TokenAuthMiddleware  
import chat.routing
from django.core.asgi import get_asgi_application

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    )

})
