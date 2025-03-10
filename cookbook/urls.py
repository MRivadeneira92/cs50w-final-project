"""
URL configuration for cookbook project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('<int:id>/<str:name>', views.recipe_page, name='recipe'),
    path('get_ingredients/<str:name>', views.get_ingredients),
    path('get_recipe/<str:id_list>', views.get_recipe),
    path('add', views.add, name='add'),
    path('all-recipes', views.all_recipes, name='all-recipes'),
    path('homepage-editor', views.homepage_editor, name='editor')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
