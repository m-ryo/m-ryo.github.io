# -*- coding: utf-8 -*-
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        loader = tornado.template.Loader(".")
        #self.write(loader.load("index.html").generate())

class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print("connection opened...")
        self.write_message("The server says: 'Hello'. Connection was accepted.")

    def on_message(self, message):
        #self.write_message("The server says: " + message + " back at you")
        print('received: ' + message)

    def on_close(self):
        print('connection closed...')

    def check_origin(self, origin):
        return True

application = tornado.web.Application([
    (r'/ws', WSHandler),
    (r'/http', MainHandler),
    (r"/(.*)", tornado.web.StaticFileHandler, {"path": "./resources"}),
])

if __name__ == "__main__":
    application.listen(24000)
    tornado.ioloop.IOLoop.instance().start()
    
