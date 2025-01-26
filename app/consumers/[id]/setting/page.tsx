export default function ConsumerSettings({ params }: { params: { id: string } }) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Settings for Consumer #{params.id}</h1>
        <p>Here you can update your account settings.</p>
      </div>
    );
  }
  