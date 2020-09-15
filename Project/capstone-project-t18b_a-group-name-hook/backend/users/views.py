from django.shortcuts import render, redirect
from django.http import JsonResponse
from rest_framework.decorators import api_view, renderer_classes, action
from django.contrib import messages
from .forms import UserRegisterForm, AccountAuthenticationForm
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import login, authenticate
from django.db import models, transaction
from django.contrib.sessions.models import Session

from .utils import already_login
from .models import *

import json
import jwt

EXPIRE_TIME = 24 * 60

@transaction.atomic
def register(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		data['password1'] = data['password']
		form = UserRegisterForm(data)
		if form.is_valid():
			form.save()
			email = form.cleaned_data.get('email')
			#need to add flash message in html page (message.tags)
			raw_password = form.cleaned_data.get('password')
			account = authenticate(email=email, password=raw_password)
			messages.success(request, f'Your account has been created. You are able to Login')
			login(request, account)

			# Generate JWT token
			encoded_jwt = jwt.encode({'id': account.id}, 'SECRET', algorithm='HS256').decode('utf-8')
			response = JsonResponse({"token": str(encoded_jwt)})
			response.set_cookie('token', str(encoded_jwt), max_age=EXPIRE_TIME)
			return response

	return JsonResponse({"message": "Credential does not match the record"}, status=401)

# NEED TO DO
# def logout_view(request):
# 	logout(request)
# 	return redirect('/')

@api_view(["POST"])
def login_view(request):
	data = json.loads(request.body)
	form = AccountAuthenticationForm(data)
	if form.is_valid():
		email = data['email']
		password = data['password']
		user = authenticate(email=email, password=password)
		if user:
			login(request, user)
			# encoded_jwt = jwt.encode({'id': user.pk}, 'SECRET', algorithm='HS256')
			encoded_jwt = jwt.encode({'id': user.pk}, 'SECRET', algorithm='HS256').decode('utf-8')
			response = JsonResponse({"token": str(encoded_jwt)})
			response.set_cookie('token', str(encoded_jwt), max_age=EXPIRE_TIME)
			response["Access-Control-Allow-Origin"] = "*"
			response["Access-Control-Allow-Credentials"] = True
			return response

	#form = AccountAuthenticationForm()
	data = {'message': 'Credential does not match the record'}
	return JsonResponse(data, status=401)

@api_view(["POST"])
def validate(request):
	user = already_login(request)
	if not user:	
		return JsonResponse(None, safe=False, status=401)
		
	return JsonResponse(None, safe=False)

@api_view(["GET"])
def profile(request):
	user = already_login(request)
	if not user:
		data = {'message': 'User not Logged In'}
		return JsonResponse(data, status=401)

	return JsonResponse({'email': user.email})

@api_view(["POST"])
def changePassword(request):
	user = already_login(request)
	if not user:
		data = {'message': 'User not Logged In'}
		response = JsonResponse(data, status=401)
		return response

	data = json.loads(request.body)
	oldPassword = data['oldPassword']
	newPassword = data['newPassword']
	if user.check_password(oldPassword):
		user.change_password(newPassword)
	else:
		data = {'message': 'Old Password is does not match the record'}
		return JsonResponse(data, status=400)

	return JsonResponse({'message': 'Changed successfully'})
