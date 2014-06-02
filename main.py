import os

from google.appengine.api import users

import jinja2
import webapp2


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates")),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class MainPage(webapp2.RequestHandler):

    def get(self):

        if users.get_current_user():
            template_name = 'app.html'
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            template_name = 'home.html'
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        template_values = {
            'auth_url': url,
            'auth_url_linktext': url_linktext,
        }

        template = JINJA_ENVIRONMENT.get_template(template_name)
        self.response.write(template.render(template_values))


app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
