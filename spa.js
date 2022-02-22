const app = {
    pages: [],
    show: new Event("show"),
    init: init,
    onNavigateClick: onNavigateClick,
    pageShown: ShowPage,
    poppin: popIn,
};
document.addEventListener("DOMContentLoaded", app.init);
function navigateTo(pageName) {

    var targetPageElement = document.querySelector('[data-current=' + pageName + ']');

    //document.querySelector('[data-target=' + pageName + ']')
    document.querySelector(".active").classList.remove("active");
    targetPageElement.classList.add('active');
    // document.getElementsByTagName(currentPage).classList.add("active");
    history.pushState({}, pageName, `#${pageName}`);
    // targetPageElement.dispatchEvent(app.show);
}
function init() {

    document.querySelectorAll(".navigation-btn")
        .forEach((link) => {
            link.addEventListener("click", app.onNavigateClick);
        });
    // console.log("hi");
    // app.pages = document.querySelectorAll(".page");
    // app.pages.forEach((pg) => {
    //     pg.addEventListener("show", app.pageShown);
    // });
    // document.querySelectorAll(".navigation-btn").forEach((link) => {
    //     link.addEventListener("click", app.nav);
    // });
    history.replaceState({}, "logIn", "?");
    //בדיקה אם יש יוזר בלוגין
    var isLogin = isLogIn();
    if (isLogin) {
        buildProductListHtml();
        navigateTo('productList');
    }
    // window.addEventListener("click", app.poppin);

}
function onNavigateClick(ev) {
    ev.preventDefault();
    let pageName = ev.target.getAttribute("data-target");
    navigateTo(pageName);
}

function ShowPage(ev) {
    console.log("page", ev.target.id, "just shown");
}

function popIn() {

    console.log(location.hash, "popstate event");

}
