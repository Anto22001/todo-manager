import { useCallback, useEffect, useMemo, useState } from "react";
import { TodoCard, TodosWrapper, TodoModal, TodosFilters, MultipleSelection, TodoCardButton } from "../components";
import { getAllTodos, getAllCategories, toggleTodosCompletion, deleteTodos } from "../services/api";
import { handleError, priorities } from "../utils/utils";
import _ from "lodash";

function Todos(){
    const [showTodoModal, setShowTodoModal] = useState(false);
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filtersToApply, setFiltersToApply] = useState({});
    const [allowSelection, setAllowSelection] = useState(false);
    const [selectedTodos, setSelectedTodos] = useState(new Set());

    const handleTodoSelection = (todo) => {
        setSelectedTodos((prev) => {
            const newSet = new Set(prev);
            newSet.has(todo) ? newSet.delete(todo) : newSet.add(todo);
            return newSet;
        });
    }

    const handleAllSelection = () => {
        const currentTodos = filteredTodos.length > 0 ? filteredTodos : todos;
        setSelectedTodos(new Set(selectedTodos.size == currentTodos.length ? [] : currentTodos));
    }

    const handleMultipleDeletion = async() => {
        if(!window.confirm("Are you sure to delete selected Todos?")) return;

        try {
            const ids = Array.from(selectedTodos).map(t => t.id)
            const response = await deleteTodos(ids);

            if(response.data?.success){
                setTodos(prev => prev.filter(t => !ids.includes(t.id)));
                onDisableSelection();
            }
        } catch (err) {
            handleError(err);
        }
    }

    const handleMultipleCompletation = async() => {
        try {
            const { completedIds, toCompleteIds } = Array.from(selectedTodos).reduce(
                (acc, t) => {
                  (t.completed ? acc.completedIds : acc.toCompleteIds).push(t.id);
                  return acc;
                },
                { completedIds: [], toCompleteIds: [] }
            );

            const data = {
                completedIds,
                toCompleteIds,
                date: new Date()
            }

            const response = await toggleTodosCompletion(data);

            if(response.data?.success){
                const updatedMap = new Map(
                    response.data?.data?.map(el => [el.id, el])
                );

                setTodos(prev => prev.map(todo => updatedMap.get(todo.id) || todo));
                onDisableSelection();
            }
        } catch (err) {
            handleError(err);
        }
    }

    const onEnableSelection = () => setAllowSelection((prev) => !prev);

    const onDisableSelection = () => {
        setSelectedTodos(new Set());
        setAllowSelection(false);
    }

    const handleShowModal = (show) => {
        setShowTodoModal(show);
        document.body.style.overflow = show ? "hidden" : "auto"
    }

    const applyFilters = (todos, f) => {
        if(!Object.hasOwn(f, "filterBy")) return;

        let filtered = [...todos];
        const filters = f.filterBy;

        const selectedCategories = filters.find(f => f.key === "Category")?.value
          .filter(v => v.value)
          .map(v => v.id) || [];
        if (selectedCategories.length) {
          filtered = filtered.filter(t => selectedCategories.includes(t.category_id));
        }

        const selectedPriorities = filters.find(f => f.key === "Priority")?.value
          .filter(v => v.value)
          .map(v => v.id) || [];
        if (selectedPriorities.length) {
          filtered = filtered.filter(t => selectedPriorities.includes(t.priority));
        }

        const deadlineFilters = filters.find(f => f.key === "Deadline")?.value || [];
        const withDeadline = deadlineFilters.find(v => v.key === "With deadline" && v.value);
        const withoutDeadline = deadlineFilters.find(v => v.key === "Without deadline" && v.value);
        if (withDeadline && !withoutDeadline) filtered = filtered.filter(t => t.deadline);
        if (!withDeadline && withoutDeadline) filtered = filtered.filter(t => !t.deadline);

        const stateFilters = filters.find(f => f.key === "State")?.value || [];
        const selectedStates = stateFilters
          .filter(v => v.value)
          .map(v => v.id);
        if (selectedStates.length) {
          filtered = filtered.filter(t => {
            if (t.completed && selectedStates.includes(2)) return true; // Completed
            if (!t.completed) {
              const now = new Date().setHours(0,0,0,0);
              const deadlineTime = t.deadline ? new Date(t.deadline).setHours(0,0,0,0) : null;
              if (deadlineTime && deadlineTime < now && selectedStates.includes(1)) return true; // Expired
              if ((!t.deadline || deadlineTime >= now) && selectedStates.includes(0)) return true; // Todo
            }
            return false;
          });
        }

        return filtered;
    }

    const applySort = (todos, f) => {
        if(!Object.hasOwn(f, "orderBy")) return;

        const iteratees = [];
        const directions = [];

        f.orderBy.forEach(order => {
          if (!order.value) return;
          switch (order.key) {
            case "Deadline":
              iteratees.push(t => t.deadline ? new Date(t.deadline).getTime() : Infinity);
              directions.push('asc'); 
              break;
            case "Priority":
              iteratees.push(t => t.priority);
              directions.push('asc');
              break;
            case "Creation Date":
              iteratees.push(t => new Date(t.created_at).getTime());
              directions.push('asc');
              break;
            case "Completation Date":
              iteratees.push(t => t.completed && t.completed_at ? new Date(t.completed_at).getTime() : Infinity);
              directions.push('asc');
              break;
            default:
              break;
          }
        });

        return _.orderBy(todos, iteratees, directions);
    }

    const updateTodosOnCreate = (newTodo) => {
        setTodos(prev => sortTodos([...prev, newTodo]))
        onDisableSelection();
    }

    const defaultFilters = useMemo(() => ({
        orderBy: [
            {
                key: "Deadline",
                value: true,
            },
            {
                key: "Priority",
                value: false,
            },
            {
                key: "Creation Date",
                value: false,
            },
            {
                key: "Completation Date",
                value: false,
            }
        ],
        filterBy: [
            {
                key: "Category",
                value: categories.map(c => {
                    return {
                        id: c.id,
                        key: c.title,
                        value: false
                    }
                })
            },
            {
                key: "Priority",
                value: priorities.map(p => {
                    return {
                        id: p.id,
                        key: p.title,
                        value: false
                    }
                })
            },
            {
                key: "Deadline",
                value: [
                    {
                        id: 0,
                        key: "With deadline",
                        value: false
                    },
                    {
                        id: 1,
                        key: "Without deadline",
                        value: false
                    }
                ]
            },
            {
                key: "State",
                value: [
                    {
                        id: 0,
                        key: "Todo",
                        value: false
                    },
                    {
                        id: 1,
                        key: "Expired",
                        value: false
                    },
                    {
                        id: 2,
                        key: "Completed",
                        value: false
                    },
                ]
            }
        ]
    }), [categories])

    const filteredTodos = useMemo(() => {
        if(Object.keys(filtersToApply).length === 0) return todos;

        let filtered = applyFilters(todos, filtersToApply);
        let sorted = applySort(filtered, filtersToApply);
        return sorted || [];
    }, [filtersToApply, todos]);

    const hasFilters = Object.keys(filtersToApply).length > 0;
    const todosToDisplay = hasFilters ? filteredTodos : todos;
    const isEmpty = todos.length === 0;
    const noResults = hasFilters && filteredTodos.length === 0;

    const sortTodos = useCallback((allTodos) => {
        return applySort(allTodos, hasFilters ? filtersToApply : defaultFilters)
    }, [defaultFilters, filtersToApply, hasFilters])

    const loadData = async() => {
        try {
            const [todosRes, categoriesRes] = await Promise.all([
                getAllTodos(),
                getAllCategories()
            ]);

            if(todosRes?.data?.success){
                setTodos(sortTodos(todosRes.data.data));
            }
            if(categoriesRes?.data?.success){
                setCategories(categoriesRes.data.data);
            }
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className="w-full flex flex-col gap-10">
        <div className="sticky top-0 bg-[#242424] z-50 py-5">
            <div className="flex flex-row-reverse justify-between gap-5">
                <TodosFilters 
                    filters={hasFilters ? filtersToApply : defaultFilters} 
                    handleClearFilter={() => setFiltersToApply({})} 
                    setFiltersToApply={setFiltersToApply}
                />
                {todosToDisplay.length > 0 && 
                    <MultipleSelection 
                        selection={selectedTodos} 
                        allTodosLength={todosToDisplay.length} 
                        isEnabled={allowSelection} 
                        enableSelection={onEnableSelection} 
                        onDelete={handleMultipleDeletion} 
                        onComplete={handleMultipleCompletation} 
                        onSelectAll={handleAllSelection} 
                    />
                }
            </div>
        </div>
        {(isEmpty || noResults) && 
            <div className="filters-error px-10 py-3 flex justify-center items-center">
                {noResults ? 
                    <p className="font-bold text-[#e05454] max-w-[400px]">
                     Non ci sono Todos che soddisfino i filtri selezionati!
                    </p> : 
                    <p className="font-bold text-[#9ade69]">
                      Crea il tuo primo Todo cliccando sul riquadro con l'icona
                      <img width="24" height="24" src="/plus-white.svg" alt="Plus Icon" className="inline ml-2"/>
                    </p>
                }
            </div>
        }
        <TodosWrapper>
            <TodoCardButton handleClick={() => handleShowModal(true)}/>
            {todosToDisplay.map((t) => {
                const category = categories.find(c => c.id == t.category_id);
                return <TodoCard 
                    key={t.id} 
                    t={t} 
                    c={category} 
                    selectable={allowSelection} 
                    onSelect={handleTodoSelection} 
                    selected={selectedTodos?.has(t) || false}
                />
            })}
        </TodosWrapper>
        {showTodoModal && 
            <TodoModal 
                categories={categories} 
                handleShowModal={(show) => handleShowModal(show)} 
                handleOnCreation={updateTodosOnCreate}
            />
        }
    </div>;
}

export default Todos;