No ...frontend> serve -l 5500
--> http://localhost:5500

No ...backend> npm start
        (deve aparecer:)
        > formulario-seguro-backend@1.0.0 start
        > node app.js

        Middleware validateForm carregado
        Controller formController carregado

        Servidor rodando na porta 3000
        Ambiente: development
        Frontend URL: http://localhost:5500
        CSRF Protection: Ativado

--> http://localhost:3000/api/csrf-token

        (exemplo:)
        {
            "csrfToken": "91fac680c2e48b90b3bc1abca6b1a5f9c337b1e45e047a53dfe85d701cb80580",
            "timestamp": "2025-05-25T05:01:23.282Z"
        }

