// ===== food-packages.js =====
// Emergency Dashboard — Food Packages Inventory System

class FoodInventory {
  constructor() {
    this.storageKey = "foodInventory";
    this.foodList = JSON.parse(localStorage.getItem(this.storageKey)) || this.getSampleData();
  }

  // Default demo data (if empty)
  getSampleData() {
    const sample = [
      { id: "f1", name: "Rice (10kg bags)", quantity: 120, unit: "bags", minStock: 80, status: "adequate" },
      { id: "f2", name: "Dry Biscuits", quantity: 40, unit: "boxes", minStock: 60, status: "low" },
      { id: "f3", name: "Baby Food", quantity: 15, unit: "cartons", minStock: 25, status: "critical" },
    ];
    localStorage.setItem(this.storageKey, JSON.stringify(sample));
    return sample;
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.foodList));
  }

  calculateStatus(quantity, minStock) {
    if (quantity < minStock * 0.3) return "critical";
    if (quantity < minStock * 0.7) return "low";
    return "adequate";
  }

  showInventory(parent) {
    const div = document.createElement("div");
    div.className = "medicine-inventory"; // reuse existing styles
    div.innerHTML = `
      <div class="medicine-header">
        <h4>🍱 Food Packages</h4>
        <button class="add-medicine-btn" onclick="foodManager.showAddForm()">+ Add</button>
      </div>

      <div class="inventory-summary">
        <span>Total: ${this.foodList.length}</span>
        <span>Updated: ${new Date().toLocaleDateString()}</span>
      </div>

      <table class="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.foodList.map(i => `
            <tr>
              <td>${i.name}</td>
              <td>${i.quantity}</td>
              <td>${i.unit}</td>
              <td class="status-${i.status}">${i.status.toUpperCase()}</td>
              <td>
                <button class="btn-small" onclick="foodManager.editItem('${i.id}')">Edit</button>
                <button class="btn-small btn-danger" onclick="foodManager.removeItem('${i.id}')">Del</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    parent.appendChild(div);
  }

  removeInventory(parent) {
    const inv = parent.querySelector(".medicine-inventory");
    if (inv) inv.remove();
  }

  showAddForm() {
    const form = document.createElement("div");
    form.className = "medicine-form";
    form.innerHTML = `
      <div class="form-group">
        <label>Food Item Name</label>
        <input type="text" id="foodName" />
      </div>
      <div class="form-group">
        <label>Quantity</label>
        <input type="number" id="foodQty" />
      </div>
      <div class="form-group">
        <label>Unit</label>
        <input type="text" id="foodUnit" />
      </div>
      <div class="form-group">
        <label>Minimum Stock</label>
        <input type="number" id="foodMin" />
      </div>
      <div class="form-buttons">
        <button class="add-medicine-btn" onclick="foodManager.addItem()">Add</button>
        <button class="btn-secondary" onclick="this.closest('.medicine-form').remove()">Cancel</button>
      </div>
    `;
    document.querySelector(".medicine-inventory").appendChild(form);
  }

  addItem() {
    const name = document.getElementById("foodName").value.trim();
    const quantity = parseInt(document.getElementById("foodQty").value);
    const unit = document.getElementById("foodUnit").value.trim();
    const minStock = parseInt(document.getElementById("foodMin").value);

    if (!name || !quantity || !unit || !minStock) {
      showNotification("Please fill all fields!", "error");
      return;
    }

    const item = {
      id: Date.now().toString(36),
      name,
      quantity,
      unit,
      minStock,
      status: this.calculateStatus(quantity, minStock)
    };

    this.foodList.push(item);
    this.save();

    const openLi = document.querySelector(".supplies li.open");
    if (openLi) {
      this.removeInventory(openLi);
      this.showInventory(openLi);
    }

    showNotification(`Added ${name}`, "success");
  }

  editItem(id) {
    const item = this.foodList.find(i => i.id === id);
    if (!item) return;

    const newQty = prompt(`Update quantity for ${item.name}:`, item.quantity);
    if (newQty !== null) {
      item.quantity = parseInt(newQty);
      item.status = this.calculateStatus(item.quantity, item.minStock);
      this.save();

      const openLi = document.querySelector(".supplies li.open");
      if (openLi) {
        this.removeInventory(openLi);
        this.showInventory(openLi);
      }

      showNotification(`Updated ${item.name}`, "success");
    }
  }

  removeItem(id) {
    const item = this.foodList.find(i => i.id === id);
    if (!item) return;

    if (confirm(`Delete ${item.name}?`)) {
      this.foodList = this.foodList.filter(i => i.id !== id);
      this.save();

      const openLi = document.querySelector(".supplies li.open");
      if (openLi) {
        this.removeInventory(openLi);
        this.showInventory(openLi);
      }

      showNotification(`Removed ${item.name}`, "success");
    }
  }
}

// Global instance
const foodManager = new FoodInventory();
