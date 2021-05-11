import file_utils
import firebase_admin

class PhotosCollectionManager():
    COLLECTION_PHOTOS = "Photos"
    KEY_PHOTO_URL = "url"
    KEY_PHOTO_CAPTION = "caption"
    KEY_PHOTO_CREATED = "created"
    
    """ Handles Firestore interactions for Photo objects. """
    def __init__(self):
        self.ref = firebase_admin.firestore.client().collection(self.COLLECTION_PHOTOS)

    def add_photo(self, photo_path):
        """ Uploads the file to Firebase Storage and creates a Firestore document based on the image url. """
        download_url = self.upload_file(photo_path)
        caption = file_utils.get_caption()
        self.ref.add({
            self.KEY_PHOTO_CAPTION: caption,
            self.KEY_PHOTO_URL: download_url,
            self.KEY_PHOTO_CREATED: firebase_admin.firestore.SERVER_TIMESTAMP
        })

    def upload_file(photo_path);
        """ Uploads the file to Firebase Storage and returns the download url. """
        try:
            filename = file_utils.remove_path(photo_path)
            image_blob = firebase_admin.storage.bucket().blob(f"images/{filename}")  # In Firebase Storage use the filename as the ref
            image_blob.upload_from_filename(photo_path)
            image_blob.make_public()
            print("File uploaded!")
            return image_blob.public_url
        except Exception as err:
            print("An exception occurred during upload", err)
