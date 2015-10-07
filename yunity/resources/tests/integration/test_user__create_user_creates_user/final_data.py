from yunity.models import User

created_user = User.objects.filter(email='foodsharing-raphi@gmail.com')
assert len(created_user) == 1, 'user was not created'
created_user = created_user[0]

latitude = created_user.locations[0]['latitude']
longitude = created_user.locations[0]['longitude']
assert (latitude, longitude) == (12.345, 67.89), 'latitude {} and longitude {} not matching'.format(latitude, longitude)

display_name = created_user.display_name
assert display_name == 'Foodsharing Raphi', 'display name does not match'
