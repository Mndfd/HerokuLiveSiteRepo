"use strict";
(function () {
    function AuthGuard() {
        let protected_routes = [
            "/contact-list",
            "/edit"
        ];
        if (protected_routes.indexOf(location.pathname) > -1) {
            if (!sessionStorage.getItem("user")) {
                location.href = "/login";
            }
        }
    }
    function AddNavigationEvents() {
        let NavLinks = $("ul>li>a");
        NavLinks.off("click");
        NavLinks.off("mouseover");
        NavLinks.on("click", function () {
            location.href = $(this).attr("data");
        });
        NavLinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function DisplayHomePage() {
        console.log("Home Page");
        $("#AboutUsButton").on("click", () => {
            location.href = "/about";
        });
        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`);
        $("main").append(`<article>
        <p id="ArticleParagraph" class ="mt-3">This is the Article Paragraph</p>
        </article>`);
    }
    function DisplayProductsPage() {
        console.log("Products Page");
    }
    function DisplayServicesPage() {
        console.log("Services Page");
    }
    function DisplayAboutPage() {
        console.log("About Page");
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function ValidateField(fieldID, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();
        $("#" + fieldID).on("blur", function () {
            let text_value = $(this).val();
            if (!regular_expression.test(text_value)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function ContactFormValidation() {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must include at least a Capitalized First Name and a Capitalized Last Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }
    function DisplayContactPage() {
        console.log("Contact Page");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            location.href = "/contact-list";
        });
        ContactFormValidation();
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function (event) {
            if (subscribeCheckbox.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                let contact = new core.Contact(fullName, contactNumber, emailAddress);
                if (contact.serialize()) {
                    let key = contact.FullName.substring(0, 1) + Date.now();
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
    }
    function DisplayContactListPage() {
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>`;
                index++;
            }
            contactList.innerHTML = data;
            $("button.delete").on("click", function () {
                if (confirm("Are you sure?")) {
                    localStorage.removeItem($(this).val());
                }
                location.href = "/contact-list";
            });
            $("button.edit").on("click", function () {
                location.href = "/edit#" + $(this).val();
            });
        }
        $("#addButton").on("click", () => {
            location.href = "/edit#add";
        });
    }
    function DisplayEditPage() {
        console.log("Edit Page");
        ContactFormValidation();
        let page = location.hash.substring(1);
        switch (page) {
            case "add":
                {
                    $("main>h1").text("Add Contact");
                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        let fullName = document.forms[0].fullName.value;
                        let contactNumber = document.forms[0].contactNumber.value;
                        let emailAddress = document.forms[0].emailAddress.value;
                        AddContact(fullName, contactNumber, emailAddress);
                        location.href = "/contact-list";
                    });
                    $("#cancelButton").on("click", () => {
                        location.href = "/contact-list";
                    });
                }
                break;
            default:
                {
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);
                    $("#editButton").on("click", (event) => {
                        event.preventDefault();
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact.serialize());
                        location.href = "/contact-list";
                    });
                    $("#cancelButton").on("click", () => {
                        location.href = "/contact-list";
                    });
                }
                break;
        }
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html(`<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`);
            $("#logout").on("click", function () {
                sessionStorage.clear();
                $("#login").html(`<a class="nav-link" href="/login"><i class="fas fa-sign-in-alt"></i> Login</a>`);
                location.href = "/login";
            });
        }
    }
    function DisplayLoginPage() {
        console.log("Login Page");
        let messageArea = $("#messageArea");
        messageArea.hide();
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("./Data/users.json", function (data) {
                for (const user of data.users) {
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;
                    if (username == user.Username && password == user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href = "/contact-list";
                }
                else {
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            location.href = "/home";
        });
    }
    function DisplayRegisterPage() {
        console.log("Register Page");
    }
    function Display404Page() {
    }
    function Start() {
        console.log("App Started!");
        let pageID = $("body")[0].getAttribute("id");
        CheckLogin();
        switch (pageID) {
            case "home":
                DisplayHomePage();
                break;
            case "about":
                DisplayAboutPage();
                break;
            case "products":
                DisplayProductsPage();
                break;
            case "services":
                DisplayServicesPage();
                break;
            case "contact":
                DisplayContactPage();
                break;
            case "contact-list":
                AuthGuard();
                DisplayContactListPage();
                break;
            case "edit":
                AuthGuard();
                DisplayEditPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
            case "register":
                DisplayRegisterPage();
                break;
            case "404":
                Display404Page();
                break;
        }
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map