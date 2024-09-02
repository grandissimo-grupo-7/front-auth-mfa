const token = localStorage.getItem("authToken");
const tokenExpiration = localStorage.getItem("tokenExpiration");

if (!token || !tokenExpiration || Date.now() > tokenExpiration) {
    window.location.href = "login.html";
} else {
    // Token válido, você pode continuar e carregar o conteúdo protegido
    console.log("Token válido, carregando conteúdo protegido...");
}
