export function obterUsuario(){
    return JSON.parse(localStorage.getItem('usuarioLogado'));
}

export function estaLogado(){
    return obterUsuario() !== null;
}

export function ehAdmin(){
    const usuario = obterUsuario();
    return usuario?.roleUsuario === 'admin';
}

export function logout(){
    localStorage.removeItem('usuarioLogado');
    window.location.href = './login.html';
}
