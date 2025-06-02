from flask import jsonify
from werkzeug.exceptions import BadRequest, NotFound, HTTPException

def register_error_handlers(app):
    @app.errorhandler(BadRequest)
    def handle_400_error(e):
        return jsonify({
            "error": "Bad Request",
            "message": str(e.description) if hasattr(e, "description") else "Invalid request.",
            "status": 400
        }), 400

    @app.errorhandler(NotFound)
    def handle_404_error(e):
        return jsonify({
            "error": "Not Found",
            "message": str(e.description) if hasattr(e, "description") else "Resource not found.",
            "status": 404
        }), 404

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({
            "error": e.name,
            "message": e.description,
            "status": e.code
        }), e.code

    @app.errorhandler(Exception)
    def handle_generic_error(e):
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred.",
            "status": 500
        }), 500