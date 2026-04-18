const fetch = globalThis.fetch;

(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/submit-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '0123456789',
          address: '1 Rue Test',
          postalCode: '75000',
          city: 'Paris',
          message: 'Salut'
        },
        cartItems: [{ id: 1, size: '50ml', quantity: 1 }]
      })
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body:', text);
  } catch (error) {
    console.error('Request failed:', error);
  }
})();
