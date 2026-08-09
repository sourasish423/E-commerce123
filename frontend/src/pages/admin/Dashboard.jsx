import { Link } from "react-router-dom";

const Dashboard = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
    <p className="label-eyebrow">Back office</p>
    <h1 className="font-display text-page-title mt-1 mb-8">Admin dashboard</h1>

    <div className="grid sm:grid-cols-2 gap-5">
      <Link
        to="/admin/products"
        className="border border-ink/10 bg-white rounded-sm p-6 hover:border-ink/30 transition-colors"
      >
        <p className="label-eyebrow mb-2">Catalog</p>
        <h2 className="font-display text-section-title">Manage products</h2>
        <p className="text-sm text-slate-450 mt-2">Create, edit, and remove products in the catalog.</p>
      </Link>
      <Link
        to="/admin/orders"
        className="border border-ink/10 bg-white rounded-sm p-6 hover:border-ink/30 transition-colors"
      >
        <p className="label-eyebrow mb-2">Fulfillment</p>
        <h2 className="font-display text-section-title">Manage orders</h2>
        <p className="text-sm text-slate-450 mt-2">Review incoming orders and update their status.</p>
      </Link>
    </div>
  </div>
);

export default Dashboard;
