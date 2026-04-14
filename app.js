const defaultConfig = {
  orderEmail: "your-email@example.com",
  formServiceBase: "https://formsubmit.co",
};

const storeConfig = Object.assign({}, defaultConfig, window.STORE_CONFIG || {});

const newFolderFiles = [
  "new/Hand chain 150.jpeg",
  "new/Hand chain 180 (2).jpeg",
  "new/Hand chain 180 (3).jpeg",
  "new/Hand chain 180 (4).jpeg",
  "new/Hand chain 180 (5).jpeg",
  "new/Hand chain 180 (6).jpeg",
  "new/Hand chain 180 (7).jpeg",
  "new/Hand chain 180.jpeg",
  "new/انسيال باندورا جولد بليتيد ١٥٠ (2).jpeg",
  "new/انسيال باندورا جولد بليتيد ١٥٠.jpeg",
  "new/انسيال فراشات جولد بليتيد ٢٠٠ (2).jpeg",
  "new/انسيال فراشات جولد بليتيد ٢٠٠.jpeg",
  "new/بيرسينج بول باك 100 (10).jpeg",
  "new/بيرسينج بول باك 100 (11).jpeg",
  "new/بيرسينج بول باك 100 (12).jpeg",
  "new/بيرسينج بول باك 100 (2).jpeg",
  "new/بيرسينج بول باك 100 (3).jpeg",
  "new/بيرسينج بول باك 100 (4).jpeg",
  "new/بيرسينج بول باك 100 (5).jpeg",
  "new/بيرسينج بول باك 100 (6).jpeg",
  "new/بيرسينج بول باك 100 (7).jpeg",
  "new/بيرسينج بول باك 100 (8).jpeg",
  "new/بيرسينج بول باك 100 (9).jpeg",
  "new/بيرسينج بول باك 100.jpeg",
  "new/خاتم جولد بليتيد ١٤٠ (2).jpeg",
  "new/خاتم جولد بليتيد ١٤٠ (3).jpeg",
  "new/خاتم جولد بليتيد ١٤٠.jpeg",
  "new/خاتم حولد بليتيد ١٢٠ (2).jpeg",
  "new/خاتم حولد بليتيد ١٢٠ (3).jpeg",
  "new/خاتم حولد بليتيد ١٢٠.jpeg",
  "new/خاتم حولد بليتيد جولد ١٣٥ (2).jpeg",
  "new/خاتم حولد بليتيد جولد ١٣٥ (3).jpeg",
  "new/خاتم حولد بليتيد جولد ١٣٥.jpeg",
  "new/خاتم فراشة جولد بليتيد ١٤٠ (2).jpeg",
  "new/خاتم فراشة جولد بليتيد ١٤٠ (3).jpeg",
  "new/خاتم فراشة جولد بليتيد ١٤٠.jpeg",
  "new/خواتم حولد بليتيد 120 (10).jpeg",
  "new/خواتم حولد بليتيد 120 (2).jpeg",
  "new/خواتم حولد بليتيد 120 (3).jpeg",
  "new/خواتم حولد بليتيد 120 (4).jpeg",
  "new/خواتم حولد بليتيد 120 (5).jpeg",
  "new/خواتم حولد بليتيد 120 (6).jpeg",
  "new/خواتم حولد بليتيد 120 (7).jpeg",
  "new/خواتم حولد بليتيد 120 (8).jpeg",
  "new/خواتم حولد بليتيد 120 (9).jpeg",
  "new/خواتم حولد بليتيد 120.jpeg",
  "new/سلسله فراشه 135 (2).jpeg",
  "new/سلسله فراشه 135 (3).jpeg",
  "new/سلسله فراشه 135.jpeg",
];

function normalizeDigits(value) {
  const arabicDigits = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };

  return value.replace(/[٠-٩]/g, (digit) => arabicDigits[digit] || digit);
}

function parseProductFile(filePath) {
  const fileName = filePath.split("/").pop().replace(/\.[^.]+$/, "");
  const variantMatch = fileName.match(/\((\d+)\)\s*$/);
  const variant = variantMatch ? Number(variantMatch[1]) : 1;
  const baseLabel = variantMatch ? fileName.replace(/\s*\(\d+\)\s*$/, "") : fileName;
  const normalizedLabel = normalizeDigits(baseLabel);
  const priceMatch = normalizedLabel.match(/(\d+)\s*$/);
  const rawName = baseLabel.replace(/[\s-]*[٠-٩0-9]+\s*$/, "").trim();

  return {
    baseName: rawName || baseLabel.trim(),
    filePath,
    price: priceMatch ? `${priceMatch[1]} جنيه` : "اسألي عن السعر",
    variant,
  };
}

function buildDescription(name) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("hand chain") || name.includes("انسيال")) {
    return "قطعة ناعمة بلمعة أنيقة تضيف لمسة مميزة لليد وتناسب الإطلالات اليومية.";
  }

  if (name.includes("بيرسينج")) {
    return "بيرسينج ستايل عصري بتفاصيل لامعة يكمّل الإطلالة بشكل جذاب.";
  }

  if (name.includes("سلسله")) {
    return "سلسلة رقيقة بتفاصيل أنثوية ناعمة ولمسة لامعة ملفتة.";
  }

  return "خاتم أنيق بلمعة جذابة وتفاصيل مناسبة للخروجات والمناسبات.";
}

function encodeImagePath(filePath) {
  return encodeURI(filePath).replace(/#/g, "%23");
}

function injectNewFolderProducts() {
  const productsGrid = document.querySelector(".products-grid");

  if (!productsGrid) {
    return;
  }

  const parsedProducts = newFolderFiles.map(parseProductFile);
  const duplicateCounts = parsedProducts.reduce((counts, product) => {
    const key = `${product.baseName}|${product.price}`;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  parsedProducts.forEach((product) => {
    const productKey = `${product.baseName}|${product.price}`;
    const displayName =
      duplicateCounts[productKey] > 1
        ? `${product.baseName} - موديل ${product.variant}`
        : product.baseName;
    const article = document.createElement("article");
    const visual = document.createElement("div");
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const meta = document.createElement("div");
    const price = document.createElement("strong");
    const note = document.createElement("span");
    const button = document.createElement("button");

    article.className = "product-card";
    article.dataset.product = displayName;
    article.dataset.price = product.price;

    visual.className = "product-visual";
    visual.style.backgroundImage = `url("${encodeImagePath(product.filePath)}")`;

    copy.className = "product-copy";

    title.textContent = displayName;
    description.textContent = buildDescription(product.baseName);

    meta.className = "product-meta";
    price.textContent = product.price;
    note.textContent =
      duplicateCounts[productKey] > 1 ? `موديل ${product.variant}` : "إضافة جديدة";

    button.className = "product-btn";
    button.type = "button";
    button.textContent = "اطلبي هذه القطعة";

    meta.append(price, note);
    copy.append(title, description, meta, button);
    article.append(visual, copy);
    productsGrid.appendChild(article);
  });
}

injectNewFolderProducts();

const productCards = Array.from(document.querySelectorAll(".product-card"));
const form = document.getElementById("order-form");
const hiddenProduct = document.getElementById("hidden-product");
const hiddenPrice = document.getElementById("hidden-price");
const productName = document.getElementById("selected-product-name");
const productPrice = document.getElementById("selected-product-price");
const configNotice = document.getElementById("config-notice");

function selectProduct(card, options = {}) {
  const scroll = options.scroll !== false;
  const selectedName = card.dataset.product;
  const selectedPrice = card.dataset.price;

  productCards.forEach((item) => item.classList.remove("active"));
  card.classList.add("active");

  hiddenProduct.value = selectedName;
  hiddenPrice.value = selectedPrice;
  productName.textContent = selectedName;
  productPrice.textContent = selectedPrice;

  if (scroll) {
    const formTop = form.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: formTop, behavior: "smooth" });
  }
}

function configureForm() {
  const trimmedEmail = (storeConfig.orderEmail || "").trim();
  const isConfigured =
    trimmedEmail.length > 3 &&
    trimmedEmail.includes("@") &&
    trimmedEmail !== defaultConfig.orderEmail;

  if (!isConfigured) {
    configNotice.textContent =
      "تنبيه: يرجى التحقق من إعدادات التواصل لإتمام عملية الشراء بنجاح.";
    configNotice.classList.add("error");
    configNotice.style.display = "block";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      configNotice.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }

  form.action = `${storeConfig.formServiceBase}/${encodeURIComponent(trimmedEmail)}`;
  configNotice.textContent = "الموقع جاهز لاستقبال طلباتك الآن.";
  configNotice.style.display = "block";
  configNotice.classList.add("ready");
}

productCards.forEach((card) => {
  const button = card.querySelector(".product-btn");

  if (button) {
    button.addEventListener("click", () => selectProduct(card));
  }
});

if (productCards[0]) {
  selectProduct(productCards[0], { scroll: false });
}

function randomizeHeroProduct() {
  if (productCards.length === 0) return;

  const randomIndex = Math.floor(Math.random() * productCards.length);
  const randomCard = productCards[randomIndex];
  const name = randomCard.dataset.product;
  const price = randomCard.dataset.price;
  const description = randomCard.querySelector("p")
    ? randomCard.querySelector("p").textContent
    : "";

  const heroNameElem = document.getElementById("hero-p-name");
  const heroPriceElem = document.getElementById("hero-p-price");
  const heroDescElem = document.querySelector(".hero-card p");

  if (heroNameElem) heroNameElem.textContent = name;
  if (heroPriceElem) heroPriceElem.textContent = price;
  if (heroDescElem) heroDescElem.textContent = description;
}

configureForm();
randomizeHeroProduct();
