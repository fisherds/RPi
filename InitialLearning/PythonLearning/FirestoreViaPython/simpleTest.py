import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'fisherds-bucket.appspot.com'
})

bucket = storage.bucket()

# Imports the Google Cloud client library
# from google.cloud import storage
# storage_client = storage.Client()
# bucket_name = "my-new-bucket"
# bucket = storage_client.create_bucket(bucket_name)
# print("Bucket {} created.".format(bucket.name))