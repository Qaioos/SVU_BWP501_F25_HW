/**
 * دليل فعاليات الجامعة الافتراضية السورية (SVU)
 * مشروع مادة BWP401
 * ملف التحكم والعمليات التفاعلية (main.js)
 */

document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. منطق الفلترة والبحث في صفحة (events.html)
    // ==========================================
    const searchInput = document.getElementById("searchInput");
    const categorySelect = document.getElementById("categorySelect");
    const dateFilter = document.getElementById("dateFilter");
    const resetBtn = document.getElementById("resetBtn");
    const eventItems = document.querySelectorAll(".event-item");
    const noResults = document.getElementById("noResults");
    const eventsCount = document.getElementById("eventsCount");

    // التأكد من وجود عناصر الفلترة في الصفحة قبل تشغيل المنطق
    if (searchInput && categorySelect && eventItems.length > 0) {
        // دالة الفلترة والبحث الرئيسية
        function filterEvents() {
            const query = searchInput.value.toLowerCase().trim();
            const selectedCategory = categorySelect.value;
            let visibleCount = 0;

            eventItems.forEach((item) => {
                // استخراج العنوان والوصف (يدعم الفئات الجديدة والقديمة للبطاقات)
                const cardTitle =
                    (
                        item.querySelector(".card-title-text") ||
                        item.querySelector(".card-title")
                    )?.textContent.toLowerCase() || "";
                const cardText =
                    (
                        item.querySelector(".card-desc-text") ||
                        item.querySelector(".card-text")
                    )?.textContent.toLowerCase() || "";
                const itemCategory = item.getAttribute("data-category");

                // فحص المطابقة بالنص (في العنوان أو الوصف)
                const matchesSearch =
                    cardTitle.includes(query) || cardText.includes(query);

                // فحص المطابقة بالتصنيف
                const matchesCategory =
                    selectedCategory === "all" ||
                    itemCategory === selectedCategory;

                // إظهار أو إخفاء عنصر الفعالية
                if (matchesSearch && matchesCategory) {
                    item.style.display = "block";
                    visibleCount++;
                } else {
                    item.style.display = "none";
                }
            });

            // تحديث عداد الفعاليات الظاهرة ديناميكياً
            if (eventsCount) {
                eventsCount.textContent = visibleCount;
            }

            // إظهار أو إخفاء رسالة تنبيه عدم وجود نتائج
            if (noResults) {
                if (visibleCount === 0) {
                    noResults.classList.remove("d-none");
                } else {
                    noResults.classList.add("d-none");
                }
            }
        }

        // ربط الأحداث (Event Listeners) عند الكتابة أو تغيير التحديد
        searchInput.addEventListener("input", filterEvents);
        categorySelect.addEventListener("change", filterEvents);
        if (dateFilter) {
            dateFilter.addEventListener("change", filterEvents);
        }

        // زر إعادة الضبط لتفريغ الخيارات والبحث
        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                searchInput.value = "";
                categorySelect.value = "all";
                if (dateFilter) dateFilter.value = "all";
                filterEvents();
            });
        }

        // دعم قراءة التمريرات المباشرة من روابط الصفحة الرئيسية (e.g. events.html?cat=sports)
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get("cat");
        if (catParam) {
            const categoryMap = {
                academic: "academic",
                tech: "tech",
                culture: "culture",
                sports: "sports",
                workshop: "workshop",
            };
            if (categoryMap[catParam]) {
                categorySelect.value = categoryMap[catParam];
                filterEvents();
            }
        }
    }

    //  (contact.html)

    const contactForm = document.getElementById("contactForm");
    const formSuccessAlert = document.getElementById("formSuccessAlert");
    const formErrorAlert = document.getElementById("formErrorAlert");
    const errorMessageText = document.getElementById("errorMessageText");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (formSuccessAlert) formSuccessAlert.classList.add("d-none");
            if (formErrorAlert) formErrorAlert.classList.add("d-none");

            const fullName = document.getElementById("fullName")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const subject = document.getElementById("subject")?.value;
            const message = document.getElementById("message")?.value.trim();
            const termsCheck = document.getElementById("termsCheck")?.checked;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let errorMessage = "";

            if (!fullName || !email || !subject || !message) {
                errorMessage =
                    "يرجى ملء كافة الحقول المطلوبة (الاسم، البريد، الموضوع، ونص الرسالة).";
            } else if (!emailRegex.test(email)) {
                errorMessage =
                    "صيغة البريد الإلكتروني غير صحيحة (مثال صحيح: name@domain.com).";
            } else if (message.length < 10) {
                errorMessage = "يجب أن يحتوي نص الرسالة على 10 أحرف على الأقل.";
            } else if (!termsCheck) {
                errorMessage =
                    "يرجى الموافقة على الشروط وسياسة الخصوصية للمتابعة.";
            }

            if (errorMessage) {
                if (formErrorAlert && errorMessageText) {
                    errorMessageText.textContent = errorMessage;
                    formErrorAlert.classList.remove("d-none");
                    formErrorAlert.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            } else {
                if (formSuccessAlert) {
                    formSuccessAlert.classList.remove("d-none");
                    formSuccessAlert.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
                contactForm.reset();
            }
        });
    }


    
// ==========================================
// 3. منطق تبديل الوضع الداكن (Dark Mode)
// ==========================================
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// جلب الثيم المحفوظ أو الاعتماد على الوضع الفاتح كافتراضي
const savedTheme = localStorage.getItem("theme") || "light";

// تطبيق الثيم عند تحميل الصفحة
if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeIcon) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    }
}

// الاستماع لضغط زر التبديل
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        if (currentTheme === "dark") {
            // التبديل للوضع الفاتح
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            if (themeIcon) {
                themeIcon.classList.remove("fa-sun");
                themeIcon.classList.add("fa-moon");
            }
        } else {
            // التبديل للوضع الداكن
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            if (themeIcon) {
                themeIcon.classList.remove("fa-moon");
                themeIcon.classList.add("fa-sun");
            }
        }
    });
}

// (Mobile Menu Toggle)

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");

        if (mobileMenu.classList.contains("open")) {
            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");
        } else {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    });
}

});
