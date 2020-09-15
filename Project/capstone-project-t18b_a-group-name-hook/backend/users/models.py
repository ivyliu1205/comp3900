from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class MyAccountManager(BaseUserManager):
	def create_user(self, email, username, password=None):
		if not email:
			raise ValueError('Users must have an email address')
		if not username:
			raise ValueError('Users must have a username')

		#if they have email and username, create user
		user = self.model(
			email=self.normalize_email(email),		#convert lower case
			username=username,
		)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, username, password):
		user = self.create_user(
			email=self.normalize_email(email),
			password=password,
			username=username,
		)
		user.is_admin = True
		user.is_staff = True
		user.is_superuser = True
		user.save(using=self._db)
		return user


class User(AbstractBaseUser):
	email 					= models.EmailField(verbose_name="email", max_length=60, unique=True)
	username 				= models.CharField(max_length=30)
	last_login				= models.DateTimeField(verbose_name='last login', auto_now=True)
	is_admin				= models.BooleanField(default=False)
	is_staff				= models.BooleanField(default=False)
	is_active				= models.BooleanField(default=True)
	is_superuser			= models.BooleanField(default=False)


	USERNAME_FIELD = 'email'			#what you want user to login with, either email or username
	# REQUIRED_FIELDS = ['username']

	objects = MyAccountManager()

	def __str__(self):					#prints out when called
		return self.email

	# To check permissions, if admin, has permissions
	def has_perm(self, perm, obj=None):
		return self.is_admin

	# Does user have permission to view this app? yes
	def has_module_perms(self, app_label):
		return True

	def change_password(self, password):
		self.set_password(password)
		self.save()
		return True

class Profile(models.Model):
    user = User
    middle_name = models.CharField(max_length=30, blank=True)
    dob = models.DateField(null=True, blank=True)

#post save receiver
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
