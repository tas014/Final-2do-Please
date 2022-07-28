var sideBarState = false;
const domElement = document.getElementById("sidebar");

const toggleSidebar = () => {
    sideBarState = !sideBarState;
    if (sideBarState) {
        domElement.setAttribute("class", "sidebarActive");
    } else {
        domElement.setAttribute("class", "sidebarInactive");
    }
}