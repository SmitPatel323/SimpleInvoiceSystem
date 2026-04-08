# 📄 Simple Invoice System

A modern, professional SaaS-style invoice management system built with **Next.js** (Frontend) and **Django** (Backend).

## ✨ Features

### Core Requirements ✅
- **Create Invoices** - Add customer details and multiple line items
- **Automatic Calculations** - Subtotal, tax (18%), and total calculated automatically
- **Invoice List View** - Dashboard with all invoices in card layout
- **Invoice Detail View** - Professional invoice display with full details
- **Frontend/Backend Integration** - Seamless API communication
- **Data Accuracy** - Proper calculations and currency formatting

### Bonus Features 🎁
- 🔍 **Search & Filter** - Search by customer name/email, filter by status
- 🗑️ **Delete Invoice** - Remove invoices with confirmation modal
- ⭐ **Invoice Status** - Mark invoices as Pending or Paid (one-way flow)
- 🌙 **Dark Mode** - Theme toggle with persistence
- 📊 **Analytics Dashboard** - Total revenue, paid amount, invoice count
- 🔒 **Paid Invoice Lock** - Once marked as Paid, cannot revert (industrial flow)
- 🖨️ **Print Invoice** - Clean print layout with no UI elements
- 💅 **Modern UI** - SaaS-style design with Tailwind CSS
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.2.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Dark Mode Support** - System preference detection

### Backend
- **Django 6.0.4** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database
- **CORS Support** - Cross-origin requests handling
- **Auto Tax Calculation** - 18% tax on all invoices

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start development server:**
   ```bash
   python manage.py runserver
   ```
   Server runs on: `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:3000`

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## 📁 Project Structure

```
SimpleInvoiceSystem/
├── backend/
│   ├── invoices/
│   │   ├── models.py          # Invoice & LineItem models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # ViewSets
│   │   ├── admin.py           # Django admin
│   │   └── migrations/        # Database migrations
│   ├── core/
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # URL routing
│   │   └── wsgi.py            # WSGI config
│   ├── manage.py
│   ├── db.sqlite3             # Database
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── Navbar.tsx     # Navigation with dark mode
│   │   ├── invoice/
│   │   │   └── [id]/
│   │   │       └── page.js    # Invoice detail view
│   │   ├── create/
│   │   │   └── page.js        # Create invoice form
│   │   ├── page.tsx           # Dashboard/list view
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles + print styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── postcss.config.mjs
│
└── README.md
```

---

## 🔌 API Endpoints

### Base URL
```
http://127.0.0.1:8000/api/
```

### Invoices

#### List All Invoices
```
GET /invoices/
```
**Response:**
```json
[
  {
    "id": 1,
    "customer_name": "Ram Patel",
    "customer_email": "ram@gmail.com",
    "created_at": "2026-04-08T10:30:00Z",
    "subtotal": 2600.00,
    "tax": 468.00,
    "total": 3068.00,
    "status": "pending",
    "items": [
      {
        "id": 1,
        "description": "Mobile Cover",
        "quantity": 1,
        "price": 200.00
      }
    ]
  }
]
```

#### Get Invoice by ID
```
GET /invoices/{id}/
```

#### Create Invoice
```
POST /invoices/
```
**Request Body:**
```json
{
  "customer_name": "Ram Patel",
  "customer_email": "ram@gmail.com",
  "items": [
    {
      "description": "Mobile Cover",
      "quantity": 1,
      "price": 200.00
    }
  ]
}
```

#### Update Invoice Status
```
PATCH /invoices/{id}/
```
**Request Body:**
```json
{
  "status": "paid"
}
```
*Note: Once marked as "paid", cannot revert to "pending"*

#### Delete Invoice
```
DELETE /invoices/{id}/
```

---

## 💡 Usage Examples

### 1. Create an Invoice

1. Open `http://localhost:3000`
2. Click **"+ New Invoice"** button
3. Fill in customer details:
   - Full Name: `Ram Patel`
   - Email: `ram@gmail.com`
4. Add line items:
   - Description: `Mobile Cover`
   - Quantity: `1`
   - Price: `200`
5. Click **"Create Invoice"**
6. ✅ Redirected to dashboard

### 2. View Invoice Details

1. Click on any invoice card in the dashboard
2. See full invoice with:
   - Customer info
   - Line items table
   - Tax breakdown
   - Total amount
3. Options:
   - **Print Invoice** → Clean print layout
   - **Create Another** → Go to create form

### 3. Manage Invoice Status

1. On dashboard, click status dropdown for any invoice
2. Options:
   - **Pending** (orange) ⏳
   - **Paid** (green) ✓
3. Once marked **Paid**:
   - Status becomes locked 🔒
   - Cannot revert to Pending
   - Lock icon appears

### 4. Search & Filter

1. Use **search bar** to find invoices:
   - Search by customer name
   - Search by email address
2. Use **status filter**:
   - All Status
   - Pending
   - Paid

### 5. View Analytics

On dashboard, see real-time stats:
- **Total Revenue** - Sum of all invoices
- **Paid Amount** - Sum of paid invoices only
- **Total Invoices** - Count of all invoices
- **Pending** - Count of pending invoices

### 6. Dark Mode

1. Click **moon/sun icon** in navbar
2. Theme toggles immediately
3. Preference saved to localStorage
4. Next visit: same theme applied

---

## 🔐 Data Validation

### Frontend Validation
- ✅ Required fields check (name, email, items)
- ✅ Email format validation
- ✅ Quantity must be ≥ 1
- ✅ Price must be ≥ 0
- ✅ At least one item required

### Backend Validation
- ✅ Invoice creation with tax calculation
- ✅ Status change to paid is one-way (cannot revert)
- ✅ Automatic subtotal and tax calculation
- ✅ Total = Subtotal + Tax (18%)

---

## 🎨 Design Highlights

### Modern SaaS UI
- Clean, minimal layout inspired by Stripe/Notion/Linear
- Soft color palette with blue accents
- Rounded cards with shadows
- Professional typography

### Responsive Design
- Mobile-first approach
- Grid layouts (1 col → 2 cols → 3 cols on larger screens)
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

### Accessibility
- Proper focus rings
- Color-blind friendly indicators
- Semantic HTML
- Keyboard navigation support

### Print Ready
- Clean invoice layout for printing
- No navbar, buttons, or extra UI elements
- Professional business document
- Black text on white background

---

## 📊 Database Schema

### Invoice Model
```
- id: AutoField (Primary Key)
- customer_name: CharField(255)
- customer_email: EmailField
- created_at: DateTimeField (auto_now_add)
- subtotal: FloatField (auto-calculated)
- tax: FloatField (auto-calculated, 18%)
- total: FloatField (auto-calculated)
- status: CharField('pending' or 'paid', default='pending')
```

### LineItem Model
```
- id: AutoField (Primary Key)
- invoice: ForeignKey(Invoice, on_delete=CASCADE)
- description: CharField(255)
- quantity: IntegerField
- price: FloatField
```

---

## ⚙️ Configuration

### CORS Settings (Backend)
```python
CORS_ALLOW_ALL_ORIGINS = True  # Change for production
```

### API Base URL (Frontend)
```javascript
const API_URL = 'http://127.0.0.1:8000/api';
```

---

## 🚧 Future Enhancements

- 💳 Payment integration (Stripe/Razorpay)
- 👤 User authentication & multi-user support
- 📧 Email invoice delivery
- 📥 PDF export functionality
- 💾 Invoice templates
- 📈 Advanced analytics & reports
- 🧪 Unit tests & E2E tests
- 🔐 API rate limiting

---

## 🐛 Troubleshooting

### Backend Connection Error
```
Error: Cannot connect to server
```
**Solution:** Ensure Django is running on `http://127.0.0.1:8000`

### Invoice Creation Fails
```
Error: Failed to create invoice
```
**Solution:** 
- Check all required fields are filled
- Verify at least one item with description, quantity, and price
- Check browser console for detailed error

### Dark Mode Not Working
```
Theme not applying
```
**Solution:** Clear localStorage and refresh page

### Print Shows Extra UI
```
Navbar and buttons visible when printing
```
**Solution:** Clear browser cache or press F12 → refresh

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Development Notes

- **Frontend**: TypeScript + React with Next.js App Router
- **Backend**: Django REST Framework with SQLite
- **Styling**: Tailwind CSS with dark mode support
- **API**: RESTful JSON API with CORS
- **Database**: SQLite (easily switchable to PostgreSQL for production)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API endpoints documentation
3. Check browser console for error messages
4. Inspect server logs: `python manage.py runserver` output

---

**Happy invoicing! 🎉**