from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers import NoteSerializer
from note.models import Note
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token'
    ]
    return Response(routes)


class NoteViewSet(ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        author = self.request.user
        return author.notes.all()
