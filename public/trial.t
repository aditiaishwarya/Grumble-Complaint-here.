// complants.html
<!DOCTYPE html>
<html>
<body>

<h2>Raise Complaint</h2>

<input id="category" placeholder="Category">
<input id="description" placeholder="Description">

<button onclick="raiseComplaint()">Submit</button>

<h3>My Complaints</h3>
<ul id="complaints"></ul>

<script>
const token = localStorage.getItem('token');

async function raiseComplaint() {
  await fetch('/complaint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      
    },
    body: JSON.stringify({
      category: category.value,
      description: description.value
    })
  });

  loadComplaints();
}

async function loadComplaints() {
  const res = await fetch('/my-complaints', {
    headers: { 'Authorization': token }
  });

  const data = await res.json();
  complaints.innerHTML = "";

  data.forEach(c => {
    complaints.innerHTML += `<li>${c.category} - ${c.status}</li>`;
  });
}

loadComplaints();
</script>

</body>
</html>


// complint_____________-server.js
app.post('/complaint', async(req, res) =>{
    try{
        const complaint = new Complaint(req.body);
        await complaint.save();
        res.status(201).json({message: "Complaint registered."});
    }catch(error){
        res.status(500).json({error: error.message});
        console.log(error.message);
    }
})