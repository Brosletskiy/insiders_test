import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTodoLists } from '../../features/todoLists/todoListSlice';
import TodoListCard from '../../components/system/todoListCard';
import Sidebar from '../../components/system/sidebarList';
import Layout from '../../components/system/layout';
import AddListModal from '../../components/system/AddListModal';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const lists = useAppSelector(state => state.todoLists.items);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchTodoLists(user.uid));
    }
  }, [dispatch, user]);

  const filtered = lists.filter((list) =>
    list.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Sidebar searchValue={search} onSearchChange={setSearch} openModal={() => setModalOpen(true)} />

      <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((list) => (
          <TodoListCard key={list.id} list={list} />
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-gray-500">Списки не знайдено</p>
        )}
      </div>

      {modalOpen && (
        <AddListModal isOpen={modalOpen} onClose={() => {
          setModalOpen(false);
          if (user?.uid) dispatch(fetchTodoLists(user.uid));
        }} />
      )}
    </Layout>
  );
};

export default Dashboard;