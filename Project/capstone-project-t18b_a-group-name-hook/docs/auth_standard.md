# Authentication Standard
Use Django default login system


# Deprecated
## Json Web Tokens (JWT)
JWT is a token based user authentication mechanism, like session key or typical token. 

### Advantages
1. Customisable payload structure
    - Payload is allowed to contain any data, but it is recommended that the only data stored within it are for authentication only, such as user id, user type (permission), expiry time etc.
2. Stateless server side validation
    - All information for validation is supposed to be stored within the payload, and it can be validated only with a secret key stored on the server side (or public/private key pairs if asymmetric crytography us preferred). This means the server do not require extra memory to keep track of their state.

### Disadvantage
1. Payload subject to change during lifetime.
    - If any payload data may subject to change after its generation, extra mechanism must be implemented to regenerate JWT.
    - However, it is not really an disadvantage when it compares to other authentication approaches)



## Structure
- ## Header
    - alg: HS256
    - type: JWT

- ## Payload
    - id: USER ID
    - type: USER TYPE (currently there is only one type of user: 'user')
    - exp: EXPIRY TIME (timestamp: second or milisecond from epoch is enough)

- ## Secret key
    - 256-bit secret key


## Implementation Approach
### Server side
- Plugin: [Simple JWT][1]


### Client side
- Stored JWT in Cookie for security reason

[1]:https://github.com/SimpleJWT/django-rest-framework-simplejwt