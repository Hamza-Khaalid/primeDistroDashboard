// Sample product data
let products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    quantity: 15,
    price: 99.99,
    description:
      "Noise-cancelling wireless headphones with 30hr battery life",
    image: "/images/headphones.jpg",
  },
  {
    id: 2,
    name: "Smartphone X",
    category: "Electronics",
    quantity: 8,
    price: 799.99,
    description: 'Latest flagship smartphone with 6.7" AMOLED display',
    image: "/images/smartphone.jpg",
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    category: "Clothing",
    quantity: 42,
    price: 19.99,
    description: "100% cotton crew neck t-shirt in various colors",
    image: "/images/shirt.jpg"
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Home & Garden",
    quantity: 5,
    price: 49.99,
    description: "12-cup programmable coffee maker",
    image: "/images/coffeemaker.jpg",
  },
  {
    id: 5,
    name: "Organic Coffee Beans",
    category: "Food & Beverage",
    quantity: 3,
    price: 12.99,
    description: "1lb bag of organic fair trade coffee beans",
    image: "/images/beans.jpg",
  },
  {
    id: 6,
    name: "JavaScript Cookbook",
    category: "Books",
    quantity: 11,
    price: 34.99,
    description: "Modern JavaScript recipes for developers",
    image: "/images/book.jpg",
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    category: "Electronics",
    quantity: 7,
    price: 59.99,
    description: "Portable waterproof speaker with 20hr battery",
    image: "/images/speaker.jpg",
  },
  {
    id: 8,
    name: "Yoga Mat",
    category: "Home & Garden",
    quantity: 23,
    price: 29.99,
    description: "Non-slip eco-friendly yoga mat",
    image: "/images/yogamat.jpg",
  },
];

// DOM Elements
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileSidebar = document.getElementById("mobile-sidebar");
const navLinks = document.querySelectorAll(".nav-link");
const navLinksMobile = document.querySelectorAll(".nav-link-mobile");
const pageContents = document.querySelectorAll(".page-content");
const addProductBtn = document.getElementById("add-product-btn");
const addFirstProductBtn = document.getElementById("add-first-product-btn");
const productModal = document.getElementById("product-modal");
const closeModal = document.getElementById("close-modal");
const cancelProduct = document.getElementById("cancel-product");
const productForm = document.getElementById("product-form");
const productsTableBody = document.getElementById("products-table-body");
const productsCards = document.getElementById("products-cards");
const noProductsMessage = document.getElementById("no-products-message");
const searchProducts = document.getElementById("search-products");
const categoryFilter = document.getElementById("category-filter");
const notificationToast = document.getElementById("notification-toast");
const closeNotification = document.getElementById("close-notification");
const notificationBadge = document.getElementById("notification-badge");
const notificationBtn = document.getElementById("notification-btn");
const totalProductsElement = document.getElementById("total-products");
const lowStockCountElement = document.getElementById("low-stock-count");
const totalValueElement = document.getElementById("total-value");
const topProductsBody = document.getElementById("top-products-body");
const categoryReportBody = document.getElementById("category-report-body");
const chartTypeSelect = document.getElementById("chart-type");
const chartSortSelect = document.getElementById("chart-sort");
const chartLegend = document.getElementById("chart-legend");

let currentProductImage = null;
let isNewImageUploaded = false;

// Chart instances
let inventoryChart = null;
let stockStatusChart = null;
let categoryDistributionChart = null;

// Current page state
let currentPage = "dashboard";
let editingProductId = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  updateDashboard();
  renderProductsTable();
  renderProductsCards();
  updateNotificationBadge();
  initCharts();

  // Set dashboard as active page
  setActivePage("dashboard");
});

// Mobile menu toggle
mobileMenuButton.addEventListener("click", function () {
  const isOpen = mobileSidebar.classList.contains("translate-x-0");
  if (isOpen) {
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("-translate-x-full");
  } else {
    mobileSidebar.classList.remove("-translate-x-full");
    mobileSidebar.classList.add("translate-x-0");
  }
});

// Navigation links
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const page = this.getAttribute("data-page");
    setActivePage(page);
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("-translate-x-full");
  });
});

navLinksMobile.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const page = this.getAttribute("data-page");
    setActivePage(page);
    mobileSidebar.classList.remove("translate-x-0");
    mobileSidebar.classList.add("-translate-x-full");
  });
});

// Chart type and sort change handlers
chartTypeSelect.addEventListener("change", updateInventoryChart);
chartSortSelect.addEventListener("change", updateInventoryChart);

// Set active page
function setActivePage(page) {
  currentPage = page;

  // Update page content visibility
  pageContents.forEach((content) => {
    content.classList.add("hidden");
    if (content.id === `${page}-page`) {
      content.classList.remove("hidden");
    }
  });

  // Update nav link active states
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
    }
  });

  navLinksMobile.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
    }
  });

  // Update specific page content if needed
  if (page === "dashboard") {
    updateDashboard();
  } else if (page === "reports") {
    updateReports();
  }
}

// Add product button
addProductBtn.addEventListener("click", openAddProductModal);
addFirstProductBtn.addEventListener("click", openAddProductModal);

// Product modal
function openAddProductModal() {
  editingProductId = null;
  document.getElementById("modal-title").textContent = "Add New Product";
  document.getElementById("product-id").value = "";
  document.getElementById("product-name").value = "";
  document.getElementById("product-category").value = "";
  document.getElementById("product-quantity").value = "";
  document.getElementById("product-price").value = "";
  document.getElementById("product-description").value = "";

  document.getElementById("image-preview").classList.add("hidden");
  document.getElementById("preview-image").src = "";
  document.getElementById("product-image").value = "";
  currentProductImage = null;
  isNewImageUploaded = false;

  productModal.classList.remove("hidden");
}

function openEditProductModal(product) {
  editingProductId = product.id;
  document.getElementById("modal-title").textContent = "Edit Product";
  document.getElementById("product-id").value = product.id;
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-category").value = product.category;
  document.getElementById("product-quantity").value = product.quantity;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-description").value =
    product.description || "";

    if (product.image) {
        document.getElementById("image-preview").classList.remove("hidden");
        document.getElementById("preview-image").src = product.image;
        currentProductImage = product.image;
      }

  productModal.classList.remove("hidden");
}

closeModal.addEventListener("click", function () {
  productModal.classList.add("hidden");
});

cancelProduct.addEventListener("click", function () {
  productModal.classList.add("hidden");
});

// Add image upload handling
document.getElementById('product-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById('image-preview').classList.remove('hidden');
        document.getElementById('preview-image').src = event.target.result;
        currentProductImage = event.target.result;
        isNewImageUploaded = true;
      };
      reader.readAsDataURL(file);
    }
  });

// Product form submission
productForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const productData = {
    id: editingProductId || Date.now(),
    name: document.getElementById("product-name").value,
    category: document.getElementById("product-category").value,
    quantity: parseInt(document.getElementById("product-quantity").value),
    price: parseFloat(document.getElementById("product-price").value),
    description: document.getElementById("product-description").value,
    image: currentProductImage || "https://via.placeholder.com/80",
  };

  if (editingProductId) {
    // Update existing product
    const index = products.findIndex((p) => p.id === editingProductId);
    if (index !== -1) {
      products[index] = productData;
      showNotification("Product updated successfully!");
    }
  } else {
    // Add new product
    products.push(productData);
    showNotification("Product added successfully!");
  }

  // Update UI
  renderProductsTable();
  renderProductsCards();
  updateDashboard();
  productModal.classList.add("hidden");
  currentProductImage = null;
  isNewImageUploaded = false;
  document.getElementById("image-preview").classList.add("hidden");
  document.getElementById("preview-image").src = "";
  document.getElementById("product-image").value = "";
});

// Delete product
function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((product) => product.id !== id);
    renderProductsTable();
    renderProductsCards();
    updateDashboard();
    showNotification("Product deleted successfully!");
  }
}

// Render products table
function renderProductsTable() {
  const filteredProducts = filterProducts();

  if (filteredProducts.length === 0) {
    productsTableBody.innerHTML = "";
    noProductsMessage.classList.remove("hidden");
    return;
  }

  noProductsMessage.classList.add("hidden");

  let tableHTML = "";
  filteredProducts.forEach((product) => {
    const status = getStockStatus(product.quantity);
    const statusClass = `px-2 py-1 rounded-full text-xs font-medium ${status.class}`;

    tableHTML += `
              <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <img src="${product.image}" alt="${product.name}" class="h-10 w-10 rounded object-cover">
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">${
                        product.name
                      }</div>
                      <div class="text-sm text-gray-500 truncate max-w-xs">${
                        product.description
                      }</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                    product.category
                  }</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                    product.quantity
                  }</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${product.price.toFixed(
                    2
                  )}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <span class="${statusClass}">${status.text}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onclick="openEditProductModal(${JSON.stringify(
                        product
                      ).replace(
                        /"/g,
                        "&quot;"
                      )})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                          <i class="fas fa-edit"></i>
                      </button>
                      <button onclick="deleteProduct(${
                        product.id
                      })" class="text-red-600 hover:text-red-900">
                          <i class="fas fa-trash"></i>
                      </button>
                  </td>
              </tr>
          `;
  });

  productsTableBody.innerHTML = tableHTML;
}

// Render products cards for mobile
function renderProductsCards() {
  const filteredProducts = filterProducts();

  if (filteredProducts.length === 0) {
    productsCards.innerHTML = "";
    return;
  }

  let cardsHTML = "";
  filteredProducts.forEach((product) => {
    const status = getStockStatus(product.quantity);
    const statusClass = `px-2 py-1 rounded-full text-xs font-medium ${status.class}`;

    cardsHTML += `
              <div class="product-card bg-white rounded-lg shadow p-4 transition duration-150 ease-in-out">
                  <div class="flex items-start space-x-4">
                      <img src="${product.image}" alt="${product.name}" class="h-16 w-16 rounded object-cover">
                      <div class="flex-1 min-w-0">
                          <h3 class="text-sm font-medium text-gray-900 truncate">${
                            product.name
                          }</h3>
                          <p class="text-xs text-gray-500">${
                            product.category
                          }</p>
                          <div class="mt-1 flex items-center space-x-4">
                              <span class="text-sm text-gray-500">Qty: ${
                                product.quantity
                              }</span>
                              <span class="text-sm text-gray-500">$${product.price.toFixed(
                                2
                              )}</span>
                              <span class="${statusClass}">${
      status.text
    }</span>
                          </div>
                      </div>
                  </div>
                  <div class="mt-3 flex justify-end space-x-2">
                      <button onclick="openEditProductModal(${JSON.stringify(
                        product
                      ).replace(
                        /"/g,
                        "&quot;"
                      )})" class="text-indigo-600 hover:text-indigo-900 text-sm">
                          <i class="fas fa-edit mr-1"></i> Edit
                      </button>
                      <button onclick="deleteProduct(${
                        product.id
                      })" class="text-red-600 hover:text-red-900 text-sm">
                          <i class="fas fa-trash mr-1"></i> Delete
                      </button>
                  </div>
              </div>
          `;
  });

  productsCards.innerHTML = cardsHTML;
}

// Filter products based on search and category
function filterProducts() {
  const searchTerm = searchProducts.value.toLowerCase();
  const category = categoryFilter.value;

  return products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);
    const matchesCategory =
      category === "" || product.category === category;
    return matchesSearch && matchesCategory;
  });
}

// Search and filter events
searchProducts.addEventListener("input", function () {
  renderProductsTable();
  renderProductsCards();
});

categoryFilter.addEventListener("change", function () {
  renderProductsTable();
  renderProductsCards();
});

// Get stock status
function getStockStatus(quantity) {
  if (quantity === 0) {
    return { text: "Out of Stock", class: "status-out" };
  } else if (quantity < 5) {
    return { text: "Low Stock", class: "status-low" };
  } else {
    return { text: "In Stock", class: "status-in-stock" };
  }
}

// Update dashboard stats
function updateDashboard() {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.quantity > 0 && p.quantity < 5
  ).length;
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  totalProductsElement.textContent = totalProducts;
  lowStockCountElement.textContent = lowStockProducts;
  totalValueElement.textContent = `$${totalInventoryValue.toFixed(2)}`;

  // Update top selling products (mock data)
  const topProducts = [...products]
    .sort(
      (a, b) =>
        b.price * (b.quantity < 5 ? 2 : 1) -
        a.price * (a.quantity < 5 ? 2 : 1)
    )
    .slice(0, 5);

  let topProductsHTML = "";
  topProducts.forEach((product) => {
    const sales = Math.floor(Math.random() * 50) + 10; // Mock sales data
    const revenue = sales * product.price;

    topProductsHTML += `
              <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                          <img src="${product.image}" alt="${
      product.name
    }" class="h-10 w-10 rounded">
                          <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">${
                                product.name
                              }</div>
                          </div>
                      </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                    product.category
                  }</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sales}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${revenue.toFixed(
                    2
                  )}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                    product.quantity
                  }</td>
              </tr>
          `;
  });

  topProductsBody.innerHTML = topProductsHTML;

  // Update inventory chart
  updateInventoryChart();
}

// Update inventory chart based on current settings
function updateInventoryChart() {
  const chartType = chartTypeSelect.value;
  const sortBy = chartSortSelect.value;

  // Sort products based on selection
  let sortedProducts = [...products];
  if (sortBy === "name") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "quantity") {
    sortedProducts.sort((a, b) => b.quantity - a.quantity);
  } else if (sortBy === "value") {
    sortedProducts.sort(
      (a, b) => b.quantity * b.price - a.quantity * a.price
    );
  }

  // Limit to top 10 products for better visualization
  sortedProducts = sortedProducts.slice(0, 10);

  const labels = sortedProducts.map((p) => p.name);
  const quantities = sortedProducts.map((p) => p.quantity);
  const values = sortedProducts.map((p) => p.quantity * p.price);

  // Generate colors for the chart
  const backgroundColors = generateColors(sortedProducts.length);

  // Destroy existing chart if it exists
  if (inventoryChart) {
    inventoryChart.destroy();
  }

  const ctx = document.getElementById("inventory-chart").getContext("2d");

  if (chartType === "bar") {
    inventoryChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label:
              sortBy === "value"
                ? "Inventory Value ($)"
                : "Quantity in Stock",
            data: sortBy === "value" ? values : quantities,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((c) =>
              c.replace("0.2", "1")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: sortBy === "value" ? "Value ($)" : "Quantity",
            },
          },
          x: {
            title: {
              display: true,
              text: "Products",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const product = sortedProducts[context.dataIndex];
                if (sortBy === "value") {
                  return `$${product.price.toFixed(2)} × ${
                    product.quantity
                  } = $${(product.price * product.quantity).toFixed(2)}`;
                } else {
                  return `${
                    product.quantity
                  } units ($${product.price.toFixed(2)} each)`;
                }
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    });
  } else if (chartType === "pie") {
    inventoryChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: sortBy === "value" ? values : quantities,
            backgroundColor: backgroundColors,
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const product = sortedProducts[context.dataIndex];
                const label = context.label || "";
                const value = context.raw || 0;
                const percentage =
                  context.dataset.data.reduce((a, b) => a + b, 0) > 0
                    ? Math.round(
                        (value /
                          context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          )) *
                          100
                      )
                    : 0;

                if (sortBy === "value") {
                  return `${label}: $${value.toFixed(
                    2
                  )} (${percentage}%)`;
                } else {
                  return `${label}: ${value} units (${percentage}%)`;
                }
              },
            },
          },
          legend: {
            position: "right",
          },
        },
      },
    });
  } else if (chartType === "line") {
    inventoryChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label:
              sortBy === "value"
                ? "Inventory Value ($)"
                : "Quantity in Stock",
            data: sortBy === "value" ? values : quantities,
            backgroundColor: backgroundColors[0],
            borderColor: backgroundColors[0].replace("0.2", "1"),
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: sortBy === "value" ? "Value ($)" : "Quantity",
            },
          },
          x: {
            title: {
              display: true,
              text: "Products",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const product = sortedProducts[context.dataIndex];
                if (sortBy === "value") {
                  return `$${product.price.toFixed(2)} × ${
                    product.quantity
                  } = $${(product.price * product.quantity).toFixed(2)}`;
                } else {
                  return `${
                    product.quantity
                  } units ($${product.price.toFixed(2)} each)`;
                }
              },
            },
          },
        },
      },
    });
  }

  // Update legend
  updateChartLegend(sortedProducts, sortBy);
}

// Generate colors for the chart
function generateColors(count) {
  const colors = [];
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
  }

  return colors;
}

// Update chart legend
function updateChartLegend(products, sortBy) {
  let legendHTML = "";

  products.forEach((product, index) => {
    const value =
      sortBy === "value"
        ? product.quantity * product.price
        : product.quantity;
    const displayValue =
      sortBy === "value" ? `$${value.toFixed(2)}` : value;

    legendHTML += `
              <div class="legend-item" onclick="highlightChartItem(${index})">
                  <div class="legend-color" style="background-color: hsla(${
                    index * (360 / products.length)
                  }, 70%, 60%, 0.7)"></div>
                  <div class="legend-text">
                      ${product.name}: ${displayValue}
                  </div>
              </div>
          `;
  });

  chartLegend.innerHTML = legendHTML;
}

// Highlight chart item when legend is clicked
function highlightChartItem(index) {
  if (inventoryChart) {
    // Get the chart type
    const chartType = inventoryChart.config.type;

    if (chartType === "pie" || chartType === "doughnut") {
      // For pie/doughnut charts, highlight the segment
      const meta = inventoryChart.getDatasetMeta(0);
      meta.data[index].transition({ duration: 0 }).outerRadius += 10;
      inventoryChart.update();

      // Reset after animation
      setTimeout(() => {
        meta.data[index].transition({ duration: 500 }).outerRadius -= 10;
        inventoryChart.update();
      }, 500);
    } else {
      // For bar/line charts, highlight the bar/point
      const meta = inventoryChart.getDatasetMeta(0);
      const element = meta.data[index];

      // Animate the element
      inventoryChart.setActiveElements([{ datasetIndex: 0, index }]);
      inventoryChart.update();
    }
  }
}

// Update reports
function updateReports() {
  // Category distribution data for chart
  const categories = [...new Set(products.map((p) => p.category))];
  const categoryCounts = categories.map(
    (cat) => products.filter((p) => p.category === cat).length
  );

  // Stock status data for chart
  const inStock = products.filter((p) => p.quantity >= 5).length;
  const lowStock = products.filter(
    (p) => p.quantity > 0 && p.quantity < 5
  ).length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;

  // Category report data for table
  let categoryReportHTML = "";
  categories.forEach((category) => {
    const categoryProducts = products.filter(
      (p) => p.category === category
    );
    const totalQuantity = categoryProducts.reduce(
      (sum, p) => sum + p.quantity,
      0
    );
    const totalValue = categoryProducts.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );

    categoryReportHTML += `
              <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${category}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${
                    categoryProducts.length
                  }</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${totalQuantity}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${totalValue.toFixed(
                    2
                  )}</td>
              </tr>
          `;
  });

  categoryReportBody.innerHTML = categoryReportHTML;

  // Update charts
  updateStockStatusChart(inStock, lowStock, outOfStock);
  updateCategoryDistributionChart(categories, categoryCounts);
}

// Initialize charts
function initCharts() {
  // Stock status chart (reports)
  const stockStatusCtx = document
    .getElementById("stock-status-chart")
    .getContext("2d");
  stockStatusChart = new Chart(stockStatusCtx, {
    type: "doughnut",
    data: {
      labels: ["In Stock", "Low Stock", "Out of Stock"],
      datasets: [
        {
          data: [0, 0, 0], // Will be updated
          backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        },
      ],
      
    },

    
  });

  // Category distribution chart (reports)
  const categoryCtx = document
    .getElementById("category-distribution-chart")
    .getContext("2d");
  categoryDistributionChart = new Chart(categoryCtx, {
    type: "pie",
    data: {
      labels: [], // Will be updated
      datasets: [
        {
          data: [], // Will be updated
          backgroundColor: [
            "#6366F1",
            "#EC4899",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
          ],
        },
      ],
    },
  }
);
}

// Update stock status chart
function updateStockStatusChart(inStock, lowStock, outOfStock) {
  if (stockStatusChart) {
    stockStatusChart.data.datasets[0].data = [
      inStock,
      lowStock,
      outOfStock,
    ];
    stockStatusChart.update();
  }
}

// Update category distribution chart
function updateCategoryDistributionChart(categories, counts) {
  if (categoryDistributionChart) {
    categoryDistributionChart.data.labels = categories;
    categoryDistributionChart.data.datasets[0].data = counts;
    categoryDistributionChart.update();
  }
}

// Show notification
function showNotification(message) {
  const notification = document.getElementById("notification-message");
  notification.textContent = message;
  notificationToast.classList.remove("hidden");

  // Auto-hide after 3 seconds
  setTimeout(() => {
    notificationToast.classList.add("hidden");
  }, 3000);

  updateNotificationBadge();
}

// Close notification
closeNotification.addEventListener("click", function () {
  notificationToast.classList.add("hidden");
});

// Update notification badge
function updateNotificationBadge() {
  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity < 5
  ).length;
  if (lowStockCount > 0) {
    notificationBadge.textContent = lowStockCount;
    notificationBadge.classList.remove("hidden");
  } else {
    notificationBadge.classList.add("hidden");
  }
}

// Notification button
notificationBtn.addEventListener("click", function () {
    const lowStockProducts = products.filter(
        (p) => p.quantity > 0 && p.quantity < 5
    );
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'fixed top-20 right-4 bg-white rounded-lg shadow-xl p-4 w-80 z-50';
    
    // Add header
    popup.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium text-gray-900">Stock Alerts</h3>
            <button class="text-gray-400 hover:text-gray-500" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="max-h-64 overflow-y-auto">
            ${lowStockProducts.length > 0 ? 
                lowStockProducts.map(p => `
                    <div class="flex items-center py-2 border-b border-gray-100">
                        <img src="${p.image}" class="h-8 w-8 rounded mr-2">
                        <div class="flex-1">
                            <div class="text-sm font-medium text-gray-900">${p.name}</div>
                            <div class="text-xs text-red-500">${p.quantity} units remaining</div>
                        </div>
                    </div>
                `).join('') 
                : '<p class="text-gray-500">No low stock alerts at this time.</p>'
            }
        </div>
    `;

    // Add to document
    document.body.appendChild(popup);
    
    // Remove after 5 seconds
    setTimeout(() => popup.remove(), 5000);
});

// Make functions available globally for inline event handlers
window.openEditProductModal = openEditProductModal;
window.deleteProduct = deleteProduct;
window.highlightChartItem = highlightChartItem;