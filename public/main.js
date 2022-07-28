const addForm = document.querySelector('form');
        const nameInput = document.querySelector('input');
        const container = document.querySelector('section');

        function addCarToView(res) {
            container.innerHTML = ''
            nameInput.value = ''

            res.data.forEach((carName, index) => {
                container.innerHTML += `<p name=${index}>${carName}</p>`
            })

            document.querySelectorAll('p').forEach(element => {
                const theIndexValue = element.getAttribute('name');

                element.addEventListener('click', () => {
                    axios
                        .delete(`/api/cars/${theIndexValue}`)
                        .then(res => {
                            addCarToView(res)
                        })
                })
            })
        }

        function submitHandler(evt) {
            evt.preventDefault();

            axios
                .post('/api/cars', { name: nameInput.value })
                .then(res => {
                    addCarToView(res)
                })
                .catch(err => {
                    nameInput.value = ''

                    const notif = document.createElement('aside')
                    notif.innerHTML = `<p>${err.response.data}</p>
                    <button class="close">close</button>`
                    document.body.appendChild(notif)

                    document.querySelectorAll('.close').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.target.parentNode.remove()
                        })
                    })
                })
        }

        // get student list on initial load
        axios
            .get('/api/cars')
            .then(res => {
                addCarToView(res)
            })

        addForm.addEventListener('submit', submitHandler)