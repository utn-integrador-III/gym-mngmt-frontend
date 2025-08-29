    // archivo: src/services/usersService.ts

    export const usersApi = {
    create: (formData: FormData) =>
        fetch("http://localhost:8000/users/", {
        method: "POST",
        body: formData, // NO poner headers: 'Content-Type'
        }).then(res => res.json())
    };
