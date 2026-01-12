document.getElementById('customToggler').addEventListener('click', function() {
    const nav1 = document.getElementById('extended-nav');
    const nav2 = document.getElementById('collapsed-nav');
    nav1.style.display = 'none';
    nav2.style.display = 'flex';
});

document.getElementById('customToggler2').addEventListener('click', function() {
    const nav1 = document.getElementById('extended-nav');
    const nav2 = document.getElementById('collapsed-nav');
    nav1.style.display = 'flex';
    nav2.style.display = 'none';
});