

// bdgtctrllr module
var budgetController = (function() {
    
    var Expenses = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expenses.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
         
    }

    Expenses.prototype.getPercentage = function() {
        return this.percentage
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget:0,
        percentage: -1
    };
    var calculateTotal =  function(type) {
        var sum =0;
        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        })
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, des, val) {
            // create an id for the item
            var newItem, ID;

             if(data.allItems[type].length > 0 ){
                 ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
             }else{
                 ID = 0;
             }
            //  check if the item is exp or inc
            if(type === 'exp') {
                newItem = new Expenses(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
                
            }
            // push the new item into its respective array
            data.allItems[type].push(newItem);
            // return the new item
            return newItem;
        },
        deleteItem: function(type, id) {
            var ids,index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
                
            })
            index = ids.indexOf(id);
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget : function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget = exp - inc
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage
            if(data.totals.inc > 0){
                data.percentage= Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
             
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },
        getPercentage: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            })
            return allPerc; 
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data);
        }
        
    };
    





})();



// uicontrol module
var UIController = (function() {

    var DOMStrings = {
        type:'.add__type',
        description: '.add__description',
        value: '.add__value',
        addButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itemPercLabel: '.item__percentage'
    };
    
       
   

    return {
        getInput: function() {
            return{
                type : document.querySelector(DOMStrings.type).value,  //selects inc or exp
                description : document.querySelector(DOMStrings.description).value,
                value : parseFloat(document.querySelector(DOMStrings.value).value)
            };
             

        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // create the html string with a placeholder here
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //  insert the html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            },

            
            deleteListItem: function(selectorID) {
                var el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);
            },
            // clear the input fields
            clearInputFields: function() {
                var fields, newFields;
                fields = document.querySelectorAll(DOMStrings.description +',' +DOMStrings.value);
               newFields = Array.prototype.slice.call(fields);
               newFields.forEach(function(item) {
                item.value = "";
               })
               newFields[0].focus();
            },
            displayBudget: function(obj) {
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
            },
            displayPercentages: function(percentages) {
                var fields = document.querySelectorAll(DOMStrings.itemPercLabel);
                var nodeListForEach = function(list, callback) {
                    for( var i =0; i< list.length; i++) {
                        callback(list[i], i);
                    }
                };
                nodeListForEach(fields, function(cur, index) {
                    if(percentages[index]> 0) {
                        cur.textContent = percentages[index] +'%';
                    }else{
                        cur.textContent = '---';
                    }
                    
                })
            },
            
        
        getDomStrings : function() {
            return DOMStrings;
        }

        
    };
    
     





})();




// controller module
var controller = (function(bdgtCtrl, UICtrl) {

    var setUpEventListeners = function() {
        var DOM = UIController.getDomStrings();
        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e) {
        if(e.keyCode === 13 || e.which ===13) {
            ctrlAddItem();
        }
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };

    var updateBudget = function() {
        // 1. Calculate the budget
      bdgtCtrl.calculateBudget();
        // 2. Return the budget
        var budget = bdgtCtrl.getBudget();
        // 3. Display the budget
        UICtrl.displayBudget(budget);
    };
     
    var ctrlAddItem = function() {

        var input, newItem;
        // 1. get the input fields
         input = UICtrl.getInput();
         if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add  the item in the budget controller
         newItem = bdgtCtrl.addItem(input.type, input.description, input.value)
         // 3. display the item in the UI
         UICtrl.addListItem(newItem, input.type);
         // 4. Clear the input fields
         UICtrl.clearInputFields();
         }
        //  calculate and update budget
        updateBudget();
        // update percentage
        updatePercentages();
    };
    var updatePercentages = function() {
        // 1.Calculate percentages
        bdgtCtrl.calculatePercentages();
        // 2.Return percentages
        var percentages = bdgtCtrl.getPercentage();
        // 3. Diplay the percnetage in the UI
        UICtrl.displayPercentages(percentages);
    }
    var ctrlDeleteItem =function(event) {
        var itemID, splitID, type, ID;
           itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID) {
            splitID = itemID.split('-');
            console.log(splitID);
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // Delete the item from the data structure
            bdgtCtrl.deleteItem(type, ID);

            // Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // Update the UI
            updateBudget();
            // update the percentages
            updatePercentages();
        }
       
    }

    return {
        init: function() {
            console.log('Application has started!');
            setUpEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            })
        }
    }
    
    


})(budgetController, UIController);


controller.init();