// ===============================
// TOKEN CHECK
// ===============================
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

// ===============================
// GLOBAL STORAGE
// ===============================
let allComplaints = [];

// ===============================
// FETCH COMPLAINTS
// ===============================
async function getComplaints() {
    try {
        const res = await fetch("http://localhost:5000/all-complaints", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error fetching complaints");
            return;
        }

        allComplaints = data;

        displayComplaints(allComplaints);
        updateStats(allComplaints);

    } catch (err) {
        console.log("Fetch Error:", err);
    }
}

// ===============================
// DISPLAY COMPLAINTS
// ===============================
function displayComplaints(data) {
    const container = document.getElementById("complaints");
    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = "<p>No complaints found.</p>";
        return;
    }

    data.forEach(c => {

        let statusClass = "";
        if (c.status === "Pending") statusClass = "pending";
        else if (c.status === "Resolved") statusClass = "resolved";
        else if (c.status === "In-Progress") statusClass = "inprogress";

        container.innerHTML += `
            <div class="card">
                <h4>Student: ${c.student}</h4>
                <p><strong>Floor:</strong> ${c.floor || "N/A"}</p>
                <p><strong>Description:</strong> ${c.description}</p>
                <span class="status ${statusClass}">
                    ${c.status}
                </span>
            </div>
        `;
    });
}

// ===============================
// UPDATE DASHBOARD STATS
// ===============================
function updateStats(data) {

    // Total complaints
    document.getElementById("totalComplaints").innerText = data.length;

    // Unique floors
    const floors = [...new Set(data.map(c => c.floor).filter(Boolean))];
    document.getElementById("totalFloors").innerText = floors.length;

    // Status counts
    document.getElementById("pendingCount").innerText =
        data.filter(c => c.status === "Pending").length;

    document.getElementById("resolvedCount").innerText =
        data.filter(c => c.status === "Resolved").length;

    document.getElementById("progressCount").innerText =
        data.filter(c => c.status === "In-Progress").length;

    // Populate floor dropdown dynamically
    const floorFilter = document.getElementById("floorFilter");
    floorFilter.innerHTML = `<option value="">All Floors</option>`;

    floors.forEach(floor => {
        floorFilter.innerHTML +=
            `<option value="${floor}">Floor ${floor}</option>`;
    });
}

// ===============================
// APPLY FILTERS
// ===============================
function applyFilters() {
    const floor = document.getElementById("floorFilter").value;
    const status = document.getElementById("statusFilter").value;

    let filtered = allComplaints;

    if (floor) {
        filtered = filtered.filter(c => c.floor == floor);
    }

    if (status) {
        filtered = filtered.filter(c => c.status === status);
    }

    displayComplaints(filtered);
}

// ===============================
// PROFILE IMAGE UPLOAD
// ===============================
const profileUpload = document.getElementById("profileUpload");
const profilePreview = document.getElementById("profilePreview");

if (profileUpload) {
    profileUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function () {
            profilePreview.src = reader.result;
            localStorage.setItem("profileImage", reader.result);
        };

        reader.readAsDataURL(file);
    });
}

// Load saved image
const savedImage = localStorage.getItem("profileImage");
if (savedImage && profilePreview) {
    profilePreview.src = savedImage;
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ===============================
// INITIAL LOAD
// ===============================
getComplaints();