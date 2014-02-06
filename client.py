import logging
import requests
import json
import getpass

DEBUG = True


class AuthenticationError(Exception):

    """AuthenticationError"""


class CutthroatAPI(object):

    """CutthroatAPI

    >>> from client import CutthroatAPI
    >>> c = CutthroatAPI()
    Username: ...
    Password: ...
    >>> c.list_rooms()
    ...
    """

    def __init__(self, base_url="http://localhost:8888", username=None):
        self.base_url = base_url

        self.username = username if username else raw_input("Username: ")
        password = getpass.getpass()
        self.cookies = self._authenticate(self.username, password)

        self.room = None
        self.game = None

    def _authenticate(self, username, password):
        """Login with `username` and `password`"""
        r = requests.post(
            self.base_url + "/api/auth/login",
            data=json.dumps({
                "name": username,
                "password": password
            })
        )
        if DEBUG:
            print("{}\n{}".format(r, r.json()))
        return r.cookies

    def create_room(self):
        name = raw_input("Name of the room: ")
        password = raw_input("(Optional) Password to the room if you "
                             "wish to keep entry restricted to players who "
                             "know the password: ")
        owner = self.username

        data = dict(name=name, owner=owner)
        if password:
            data["password"] = password

        r = requests.post(
            self.base_url + "/api/room/createroom",
            data=json.dumps(data)
        )
        logging.info("{}\n{}".format(r, r.json()))

        if r.status_code == 200:
            self.join_room(name, password)
        return r.json()

    def list_rooms(self):
        r = requests.get(
            self.base_url + "/api/room/listrooms",
            cookies=self.cookies
        )
        if r.status_code is 200:
            return r.json()[u"data"]
        else:
            return r.json()

    def join_room(self, name=None, password=None):
        if not name:
            name = raw_input("Name of the room: ")
        if not password:
            password = raw_input(
                "(Optional) Password to the room if it has one: "
            )
        player = self.username

        data = dict(name=name, player=player)
        if password:
            data["password"] = password

        r = requests.post(
            self.base_url + "/api/room/joinroom",
            data=json.dumps(data),
            cookies=self.cookies
        )
        logging.info("{}\n{}".format(r, r.json()))

        if r.status_code == 200:
            self.room = name
        return r.json()
