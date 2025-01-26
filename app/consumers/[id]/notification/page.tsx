export default function Notifications({
    params,
  }: {
    params: { id: string };
  }) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="mt-2 text-gray-600">Your notifications, {params.id}:</p>
        {/* Add logic to fetch and display notifications */}
      </div>
    );
  }
  