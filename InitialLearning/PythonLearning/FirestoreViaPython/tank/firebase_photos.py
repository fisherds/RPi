import file_utils
from firebase_admin import firestore
from firebase_admin import storage

class PhotosCollectionManager():
    COLLECTION_PHOTOS = "Photos"
    KEY_PHOTO_URL = "url"
    KEY_PHOTO_CAPTION = "caption"
    KEY_PHOTO_CREATED = "created"
    
    """ Handles Firestore interactions for Photo objects. """
    def __init__(self):
        self.ref = firestore.client().collection(self.COLLECTION_PHOTOS)

    def add_photo(self, photo_path):
        """ Uploads the file to Firebase Storage and creates a Firestore document based on the image url. """
        download_url = self.upload_file(photo_path)
        if download_url is not None:
            caption = file_utils.get_caption()
            self.ref.add({
                self.KEY_PHOTO_CAPTION: caption,
                self.KEY_PHOTO_URL: download_url,
                self.KEY_PHOTO_CREATED: firestore.SERVER_TIMESTAMP
            })
        else:
            print("No photo added due to error during upload.")

    def upload_file(self, photo_path):
        """ Uploads the file to Firebase Storage and returns the download url. """
        try:
            filename = file_utils.remove_path(photo_path)
            print(filename)
            image_blob = storage.bucket().blob(f"photos/{filename}")  # In Firebase Storage use the filename as the ref
            image_blob.upload_from_filename(photo_path)
            image_blob.make_public()
            print("File uploaded!")
            return image_blob.public_url
        except Exception as err:
            print("An exception occurred during upload", err)
