document.addEventListener('DOMContentLoaded', (e) => {
    document.querySelector('[data-apply]').addEventListener('click', (event) => {
        //event.preventDefault();
        let amount = document.querySelector('#Amount').value;
        let base = document.querySelector('#Base').value;
        let target = document.querySelector('#Target').value;
        const API_KEY = "YOUR_API_KEY";
        const apiUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${base}&currencies=${target}`;

        // Make the Fetch API call
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Process the data

                let targetAmount = amount * data.data[target];

                let text = `${amount} ${base} = ${targetAmount.toFixed(2)} ${target}`;

                let result = document.querySelector('.result-wrap');

                result.querySelector('p').textContent = text;

                result.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});