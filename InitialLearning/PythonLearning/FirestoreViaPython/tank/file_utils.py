from datetime import datetime
import os
import pytz


def get_directory():
    """ Returns the directory of this file. """
    return os.path.dirname(os.path.realpath(__file__))


def get_filename(use_full_path=True):
    """ Returns a string for the image filename based on the current time. """
    timezone = pytz.timezone('America/New_York') 
    filename = f"{datetime.now(timezone).strftime('%B-%d-%Y@%H:%M:%S')}.jpg"
    if use_full_path:
      filename = f"{get_directory()}/images/{filename}"
    return filename


def get_caption():
    """ Returns a human readable string based on the current time. """
    timezone = pytz.timezone('America/New_York') 
    return f"{datetime.now(timezone).strftime('%A, %b %d %Y @ %l:%M:%S %p')}"


def remove_path(file_path):
  """ Removes the entire path of a file and returns just the filename.  """
  head, tail = os.path.split(file_path)
  return tail
