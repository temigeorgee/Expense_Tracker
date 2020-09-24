(function () {

    // initial array of expenses, reading from localStorage

    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    date.max = new Date().toISOString().split("T")[0];
    mobDate.max = new Date().toISOString().split("T")[0];
    let form = document.getElementById('exp-Form');

    form.onsubmit = function(e){
        e.preventDefault();
        
        let type, name, date, amount;

        // get type, name, date, and amount - MOBILE
        let mobType = document.getElementById('mobType').value;
        let mobName = document.getElementById('mobName').value;
        let mobDate = document.getElementById('mobDate').value;
        let mobAmount = parseInt(document.getElementById('mobAmount').value);

        // get type, name, date, and amount
        let typeData = document.getElementById('type').value;
        let nameData = document.getElementById('name').value;
        let dateData = document.getElementById('date').value;
        let amountData = parseInt(document.getElementById('amount').value);

        if (mobType ==="Choose..."|| mobName ==="" || mobDate ===""|| mobAmount ==="") {
        desktop();
        }else{
            type=mobType; name=mobName; date=mobDate; amount=mobAmount;
            var expense = {
                type,
                name,
                date,
                amount,
                id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
            }
            expenses.push(expense);
            localStorage.setItem("expenses", JSON.stringify(expenses))
            totalExpense();
            form.reset();
            showExpenses();
        }

        
        function desktop(){
            if (typeData ==="Choose..."|| nameData ==="" || dateData ===""|| amountData ==="") {
                return;
                }else{
                    type=typeData; name=nameData; date=dateData; amount=amountData;
                    var expense = {
                        type,
                        name,
                        date,
                        amount,
                        id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
                    }
                    expenses.push(expense);
                    localStorage.setItem("expenses", JSON.stringify(expenses))
                    totalExpense();
                    form.reset();
                    showExpenses();
                }
        }
    };

    // get total of all transaction types
    let cardTotal, cashTotal, cryptoTotal, othersTotal;
    let cardArray = [];
    let cashArray = [];
    let cryptoArray = [];
    let othersArray = [];
    expenses.forEach(function (expense) {
        if (expense.type === 'cash') {
            cashArray.push(expense.amount);
            cashTotal = cashArray.reduce((a, b) => a + b, 0);
        } else if (expense.type === 'card') {
            cardArray.push(expense.amount);
            cardTotal = cardArray.reduce((a, b) => a + b, 0);
        } else if (expense.type === 'cryptocoin') {
            cryptoArray.push(expense.amount)
            cryptoTotal = cryptoArray.reduce((a, b) => a + b, 0);
        } else if (expense.type === 'other') {
            othersArray.push(expense.amount)
            othersTotal = othersArray.reduce((a, b) => a + b, 0);
        }
    });

    // store all transaction types in array
    var amountArray = [cardTotal, cashTotal, cryptoTotal, othersTotal];

    function totalExpense() {
        var totalExpense = document.getElementById("expense-amount");
        let total = expenses.reduce((sum, a) => {
            return sum + a.amount;
        }, 0);
        totalExpense.innerText = total;
    }

    function showExpenses() {
        const expenseTable = document.getElementById('expenseTable');
        expenseTable.innerHTML = '';

        if (expenses.length > 0) {
            for (let i = 0; i < expenses.length; i++) {

                expenseTable.appendChild(createDataRow(expenses[i]));

            } // end of for loop
        } else {
            // expenses count is 0
            expenseTable.appendChild(createEmptyRow());
        }

    }

    function createEmptyRow() {
        const expenseRowEl = document.createElement('TR');

        const expenseTdTypeEl = document.createElement('TD');
        expenseTdTypeEl.setAttribute('colspan', 5);
        expenseTdTypeEl.textContent = 'No expense items yet! Please add one up top...';
        expenseRowEl.appendChild(expenseTdTypeEl);

        return expenseRowEl;
    }

    function createDataRow(expense) {

        const expenseRowEl = document.createElement('TR');

        const expenseTdTypeEl = document.createElement('TD');
        expenseTdTypeEl.textContent = expense.type;
        expenseRowEl.appendChild(expenseTdTypeEl);

        const expenseTdNameEl = document.createElement('TD');
        expenseTdNameEl.textContent = expense.name;
        expenseRowEl.appendChild(expenseTdNameEl);

        const expenseTdDateEl = document.createElement('TD');
        expenseTdDateEl.textContent = expense.date;
        expenseRowEl.appendChild(expenseTdDateEl);

        const expenseTdAmountEl = document.createElement('TD');
        expenseTdAmountEl.textContent = '$' + expense.amount;
        expenseRowEl.appendChild(expenseTdAmountEl);

        const expenseTdOptionsEl = document.createElement('TD');
        const deleteAnchorEl = document.createElement('A');
        deleteAnchorEl.className = "deleteButton";
        deleteAnchorEl.onclick = function (e) {
            deleteExpense(expense.id);


            // localStorage
            localStorage.setItem('expenses', JSON.stringify(expenses));
            showExpenses();
        }

        deleteAnchorEl.innerHTML = `<button type="button" id= "rem" class="btn btn-danger btn-sm mt-2"><i class="fa fa-trash" aria-hidden="true"></i></button>`;
        expenseRowEl.appendChild(deleteAnchorEl);

        const expenseTdOptionsE2 = document.createElement('TD');
        const ModifyAnchorE2 = document.createElement('A');
        ModifyAnchorE2.className = "ModifyButton";
        ModifyAnchorE2.onclick = function (e) {
            // let name = document.getElementById('name').value;
            let nameData = document.querySelectorAll('#name');
            nameData.forEach(function(nameEntry){
                return name = nameEntry.value;
            });
            if (name == "") {
                alert('please enter Modify')
            } else {
                ModifyExpense(expense.id);

                localStorage.setItem('expenses', JSON.stringify(expenses));
                showExpenses();
            }
        }
        // ModifyAnchorE2.innerHTML = '<button type="button" id= "modify" class="btn btn-primary ml-2" >Modify</button>';
        expenseRowEl.appendChild(ModifyAnchorE2);

        return expenseRowEl;

    }

    function deleteExpense(id) {
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].id == id) {
                expenses.splice(i, 1);
            }
            totalExpense();
        }
    }

    showExpenses();

    function ModifyExpense(id) {
        // let name = document.getElementById('name').value;
        let nameData = document.querySelectorAll('#name');
            nameData.forEach(function(nameEntry){
                return name = nameEntry.value;
            });
        if (name === '') {
            alert('please enter modify')
        } else {
            for (let i = 0; i < expenses.length; i++) {
                if (expenses[i].id == id) {
                    expenses.splice(i, 1);
                    // let type = document.getElementById('type').value;
                    // let name = document.getElementById('name').value;
                    // let date = document.getElementById('date').value;
                    // let amount = document.getElementById('amount').value;

                    let typeData = document.querySelectorAll('#type');
                    let nameData = document.querySelectorAll('#name');
                    let dateData = document.querySelectorAll('#date');
                    let amountData = document.querySelectorAll('#amount');
                    let type, name, date, amount;

                    typeData.forEach(function(typeEntry){
                        return type = typeEntry.value;
                    });
                    nameData.forEach(function(nameEntry){
                        return name = nameEntry.value;
                    });
                    dateData.forEach(function(dateEntry){
                        return date = dateEntry.value;
                    });
                    amountData.forEach(function(amountEntry){
                        return amount = parseInt(amountEntry.value);
                    });

                    if (type == 'chooseOne' || name.length <= 0 || date == '') {
                        return;
                    }
                    const expense = {
                        type,
                        name,
                        date,
                        amount,
                        id: expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1,
                    }

                    expenses.push(expense);
                    // localStorage 
                    localStorage.setItem('expenses', JSON.stringify(expenses));

                    form.reset();
                    showExpenses();
                    totalExpense();
                }
            }
        }
    }

    showExpenses();
    totalExpense();

    let myTransactionsChart = document.getElementById('transactionsChart').getContext('2d');

    // Global Options
    Chart.defaults.global.defaultFontFamily = 'Source Sans Pro, sans-serif';
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.legend.display = false;
    Chart.defaults.global.tooltips.enabled = true;
    Chart.defaults.scale.gridLines.display = false;
    Chart.defaults.scale.ticks.beginAtZero = true;

    window.onload = expenseData();

    function expenseData() {
        let ExpenseChart = new Chart(myTransactionsChart, {
            type: 'doughnut',
            data: {
                labels: ['Card', 'Cash', 'Cryptocoin', 'Others'],
                datasets: [{
                    label: 'TotalExpense',

                    data: amountArray.map(amount => amount),
                    backgroundColor: ["red", "blue", "green", "yellow"],

                }]

            },
            options: {
                responsive: true,
                legend: {
                    display: true,
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: true,
                        }
                    }]
                },

            }
        });
    }
    
    let table = document.getElementById('expenseTable');

    let editingTd;
    
    table.onclick = function(event, index, key) {
       
      // 3 possible targets
      let target = event.target.closest('.edit-cancel,.edit-ok,td');
    
      if (!table.contains(target)) return;
    
      if (target.className == 'edit-cancel') {
        finishTdEdit(editingTd.elem, false);
      } else if (target.className == 'edit-ok') {
          finishTdEdit(editingTd.elem, true);
          
      } else if (target.nodeName == 'TD') {
        if (editingTd) return; // already editing
      
        makeTdEditable(target);
      }
    
      };
    
    function makeTdEditable(td,TD) {
        editingTd = {
        elem: td,
         data: td.innerHTML
      };
    
      td.classList.add('edit-td'); // td is in edit state, CSS also styles the area inside
    
      let textArea = document.createElement('textarea');

      textArea.className = 'edit-area';
    
      textArea.value = td.innerHTML;
        td.innerHTML = ''
      td.appendChild(textArea);
      textArea.focus();
    
      td.insertAdjacentHTML("beforeEnd",
        '<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
      );
      }
       
    function finishTdEdit(td, isOk, key) {
          console.log(td.firstChild.value)
      if (isOk ){
          td.innerHTML = td.firstChild.value
          for (var i = 0; i < expenses.length; i++) {
        
        } 
             
          
         console.log(expenses)
           // showExpenses();   
          
     } else {
        td.innerHTML = editingTd.data;
      }
      td.classList.remove('edit-td');
      editingTd = null;
    }
    showExpenses()

    
      

})();
