
# What is AWS (Amazon Web Services) ?

- AWS is a cloud computing platform that provides everything you need to host, store and run applications without managing phisical servers.
You pay only what you use.

--In Simple Terms--
AWS = a global network of computers that lets you:
Store files (Amazon S3)
Host websites (S3 + CloudFront)
Run backend code (Lambda, EC2, etc)
Store databases(DynamoDB, RDS, etc)

🧩 What we used in your project:
-> Amazon S3(Simple Storage Service)
- Store the static website files (index.html, style.css, script.js)
- Host frontend publicity (like a mini web server)



I deployed my Recipe Finder app using AWS S3 as a static website host. I created a bucket, enabled static hosting and configured public access using a custom bucket policy. This allowed users to access my app through a global S3 website endpoint. The setup is completely serverless, neaning I dont need to maintain a backend server - AWS handles the storage and delivery for me.




## ☁️ AWS Deployment Overview

### 🧩 AWS Workflow Summary (Recipe Finder Project)

| Step | Stage | Description | Tool / AWS Service |
|------|--------|--------------|--------------------|
| **1** | **Development** | Built Recipe Finder using HTML, CSS, JavaScript | Visual Studio Code |
| **2** | **Testing locally** | Previewed app using Live Server | Local environment |
| **3** | **Create S3 Bucket** | Created a new bucket (e.g., `recipe-finder-23`) | Amazon S3 |
| **4** | **Upload Files** | Uploaded `index.html`, `style.css`, and `script.js` | Amazon S3 |
| **5** | **Enable Static Website Hosting** | Enabled static hosting and set `index.html` as root | Amazon S3 |
| **6** | **Set Bucket Policy** | Added public read access (`Principal: *`) | Amazon S3 |
| **7** | **Disable Block Public Access** | Allowed public access to view files | Amazon S3 |
| **8** | **Access Live URL** | Live endpoint: `http://recipe-finder-23.s3-website-eu-north-1.amazonaws.com` | Amazon S3 |
| **9** | *(Next Level)* **Enable HTTPS + CDN** | Add CloudFront for HTTPS and global delivery | AWS CloudFront |

---

### 🌍 How AWS Serves the Site

1. All static files (`index.html`, `style.css`, `script.js`) are uploaded to **Amazon S3**.  
2. When a user visits the S3 website endpoint, AWS automatically serves `index.html` as the root page.  
3. The browser then loads CSS, JavaScript, and assets directly from the bucket.  
4. API requests (to TheMealDB) are handled from the client side — no backend server required.  
5. *(Optional Next Step)* Add **CloudFront** to enable HTTPS and global caching for faster performance.

---

## 🌐 AWS CloudFront Integration (Optional – Level 8.5)

### 🔍 What Is CloudFront?

**Amazon CloudFront** is a **Content Delivery Network (CDN)** that distributes your website content through AWS edge locations worldwide.  
It improves speed and automatically adds **free HTTPS encryption**.



---

### 💡 Key Benefits

| Feature | Description |
|----------|-------------|
| ⚡ **Global speed** | Files cached at nearest AWS edge server |
| 🔒 **HTTPS enabled** | Provides free SSL certificate |
| 💾 **Caching** | Reduces load on S3 |
| 🛡️ **Security** | DDoS protection via AWS Shield |
| 🔁 **Versioning** | Refreshes when new files are uploaded |

---

### ⚙️ CloudFront Setup Workflow

1. Open **CloudFront Console** → Click **Create Distribution**
2. **Origin Domain:** Select your S3 bucket
3. **Viewer Protocol Policy:** Redirect HTTP → HTTPS
4. **Default Root Object:** `index.html`
5. Click **Create Distribution**
6. Wait for status to say **“Enabled”**
7. Access your new CDN URL, for example:  
   `https://d123abcd.cloudfront.net`
8. *(Optional)* Add your **custom domain + SSL certificate** via AWS Certificate Manager (ACM)

---

### 🌏 Example URL Transition

| Stage | URL | Description |
|--------|-----|-------------|
| Before | `http://recipe-finder-23.s3-website-eu-north-1.amazonaws.com` | S3 website endpoint |
| After | `https://d1xyzabc123.cloudfront.net` | CloudFront CDN URL |
| *(Optional)* | `https://recipefinder.fumikamikami.dev` | Custom domain with HTTPS |

---

### 🏁 Result

- Global CDN performance boost  
- Free HTTPS with no manual SSL setup  
- Lower latency + better SEO  
- Production-ready hosting for portfolio or clients  

---

# 🚀 Modern MERN + AI Developer Roadmap (6 Weeks)

**Author:** Fumika Mikami  
**Goal:** Build a future-proof full-stack skill set — combining MERN stack, AWS Cloud, and AI integration.  
**Duration:** 6 Weeks (2 hours/day)  
**Outcome:** Certified · Deployed · AI-Powered Portfolio  

---

## 🧩 Phase 1: MERN Certification & Career Growth (Weeks 1–4)

### 🎯 Focus
- Strengthen JavaScript fundamentals  
- Build and Dockerize an Express + MongoDB backend  
- Learn AWS cloud deployment  
- Polish portfolio and CV  

### ✅ Daily Progress Tracker

| Day | Topic | Task Summary | ✅ |
|-----|--------|---------------|---|
| **1** | JavaScript Refresher | Variables → Functions (SoloLearn) | [ ] |
| **2** | Arrays & Objects | map/filter/reduce practice | [ ] |
| **3** | Async JS | Promises & async-await | [ ] |
| **4** | DOM & Events | Interactive feature in TextShare | [ ] |
| **5** | ES6+ Features | Destructuring, template literals | [ ] |
| **6** | UI Polish | Tailwind/MUI responsiveness | [ ] |
| **7** | Review + Certificate | Complete SoloLearn JS Course 🏅 | [ ] |
| **8–14** | Backend + MongoDB CRUD | Build Express API + JWT + Dockerize | [ ] |
| **15–21** | AWS + CI/CD | EC2 + S3 + Lambda + GitHub Actions | [ ] |
| **22–28** | Portfolio + Job Ready | Update site, CV, LinkedIn | [ ] |

---

## 🤖 Phase 2: AI-Proof Developer Upgrade (Weeks 5–6)

### 🎯 Focus
- Integrate OpenAI / Hugging Face APIs into MERN stack  
- Add AI Interview Assistant feature to JobBoard.AI  
- Automate deploys with Docker + AWS  
- Build a strong technical identity online  

### ✅ Daily Progress Tracker

| Day | Topic | Task Summary | ✅ |
|-----|--------|---------------|---|
| **29** | AI Intro | Learn API keys, prompt design | [ ] |
| **30** | API Setup | Create Express route for OpenAI | [ ] |
| **31** | Frontend Integration | React UI for AI results | [ ] |
| **32** | Data Storage | Save prompt history (MongoDB) | [ ] |
| **33** | Error & Token Logs | Handle API limits | [ ] |
| **34** | Mini-Project | “AI Resume Analyzer” Demo | [ ] |
| **35** | Review | README + screenshots | [ ] |
| **36–42** | Advanced AI + AWS | Integrate + deploy | [ ] |

---

## 🧠 Final Deliverables

✅ **Certifications:**  
- JavaScript Fundamentals (SoloLearn)  
- MongoDB CRUD Operations  
- AWS Cloud Practitioner Essentials  

✅ **Projects:**  
- WeatherApp 🌦 (Next.js + Tailwind + Chart.js)  
- TaskManager ✅ (MUI + Dark Mode + Analytics)  
- TextShare 🔗 (Frontend-only React App)  
- JobBoard.AI 💼 (MERN + AI Integration + AWS)  

✅ **Portfolio:**  
- Updated hero + project badges  
- Blog post: *“AI didn’t replace me — it upgraded me.”*

---

## ☁️ Tech Stack Overview

**Frontend:** React, Next.js, Tailwind CSS, MUI  
**Backend:** Node.js, Express.js, Mongoose, JWT  
**Database:** MongoDB Atlas  
**Cloud:** AWS EC2, S3, Lambda, CloudFront  
**DevOps:** Docker, GitHub Actions, CI/CD  
**AI Tools:** OpenAI API, Hugging Face, ChatGPT  
**Other:** Chart.js, Recharts, Postman, Vite  

---

## 💬 Reflection

> “AI won’t take my job — it will take the boring part of my job,  
> so I can focus on creativity, system design, and human value.”

---

## 🧑‍💻 Author

**Fumika Mikami**  
MERN Full Stack Developer · AWS Certified · AI-Integrated Builder  
🔗 [Portfolio](#) · [LinkedIn](#) · [GitHub](#)
