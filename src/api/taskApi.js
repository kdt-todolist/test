import axios from 'axios';
import { handleAuthError } from '../utils/authHelpers';

export const fetchTasksFromServer = async (accessToken, setUser) => {
  try {
    const { data: serverLists } = await axios.get('http://localhost:1009/lists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = serverLists[0]?.user_id;
    if (userId) setUser(userId);

    return Promise.all(
      serverLists.map(async (serverList) => {
        const subTaskResponse = await axios.get(`http://localhost:1009/tasks/${serverList.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const serverSubTasks = subTaskResponse.data;
        return {
          id: serverList.id,
          title: serverList.title,
          isChecked: serverList.is_visible === 1,
          subTasks: serverSubTasks.map((subTask) => ({
            id: subTask.id,
            title: subTask.content,
            isChecked: subTask.done === 1,
            isRoutine: subTask.is_routine === 1,
            routines: {
              mon: subTask.mon === 1,
              tue: subTask.tue === 1,
              wed: subTask.wed === 1,
              thu: subTask.thu === 1,
              fri: subTask.fri === 1,
              sat: subTask.sat === 1,
              sun: subTask.sun === 1,
              resetTime: subTask.reset_time
            }
          })),
        };
      })
    );
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};

export const bulkTaskToServer = async (accessToken) => {
  try {
    const guestTasks = localStorage.getItem('guestTasks');

    // 로컬 스토리지에 guestTasks가 없을 경우 처리
    if (!guestTasks || guestTasks === 'null') {
      console.log('로컬스토리지에 guestTasks가 없습니다.');
      return;
    }

    const parsedGuestTasks = JSON.parse(guestTasks);

    // 파싱된 guestTasks가 유효하지 않거나 비어있는 경우 처리
    if (!Array.isArray(parsedGuestTasks) || parsedGuestTasks.length === 0) {
      console.log("업로드할 유효한 guestTasks가 없습니다.");
      return;
    }

    // 서버로 전송할 데이터를 형식에 맞게 변환
    const formattedLists = parsedGuestTasks.map((list) => ({
      title: list.title,
      isVisible: list.isChecked,
    }));

    // 리스트 데이터를 서버로 전송
    const taskBulkResponse = await axios.post(
      'http://localhost:1009/lists/bulk',
      { lists: formattedLists },
      { headers: { Authorization: `Bearer ${accessToken}` } } // 로컬스토리지에 저장된 accessToken 사용
    );

    const insertedListIds = taskBulkResponse.data.insertedIds; // 서버에서 반환된 리스트 ID들

    // 각 리스트에 해당하는 서브태스크를 서버로 전송
    await Promise.all(
      parsedGuestTasks.map(async (list, index) => {
        const subTasks = list.subTasks.map((subTask) => ({
          content: subTask.title,
          done: subTask.isChecked,
        }));

        // 서브태스크가 있을 경우에만 서버로 전송
        if (subTasks && subTasks.length > 0) {
          await axios.post(
            'http://localhost:1009/tasks/bulk',
            { listId: insertedListIds[index], tasks: subTasks },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        }
      })
    );

    // bulk 작업 완료 후 로컬스토리지의 guestTasks 삭제
    localStorage.removeItem('guestTasks');
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};

export const addNewTaskToServer = async (task, accessToken) => {
  try {
    const response = await axios.post(
      'http://localhost:1009/lists',
      { title: task.title },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return { ...task, id: response.data.insertId };
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};

export const updateTaskOnServer = async (taskId, newValue, accessToken, tasks, isChecked = false) => {
  try {
    const updatedTask = tasks.find(task => task.id === taskId);
    await axios.put(
      `http://localhost:1009/lists/${taskId}`,
      {
        title: isChecked ? updatedTask.title : newValue,
        isVisible: isChecked ? newValue : updatedTask.isChecked,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};

export const deleteTaskFromServer = async (taskId, accessToken) => {
  try {
    await axios.delete(`http://localhost:1009/lists/${taskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};

export const addSubTaskToServer = async (taskId, newTitle, isAuthenticated, accessToken) => {
  if (!isAuthenticated) return { id: Date.now(), title: newTitle, isChecked: false };

  try {
    const response = await axios.post(
      'http://localhost:1009/tasks',
      { content: newTitle, listId: taskId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return { id: response.data.insertId, title: newTitle, isChecked: false };
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};

export const updateSubTaskOnServer = async (subTaskId, newValue, accessToken, tasks, taskId, isChecked = false) => {
  try {
    const updatedSubTask = tasks.find(task => task.id === taskId).subTasks.find(subTask => subTask.id === subTaskId);
    await axios.put(
      `http://localhost:1009/tasks/${subTaskId}`,
      {
        content: isChecked ? updatedSubTask.title : newValue,
        done: isChecked ? newValue : updatedSubTask.isChecked,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};

export const deleteSubTaskFromServer = async (subTaskId, accessToken) => {
  try {
    await axios.delete(`http://localhost:1009/tasks/${subTaskId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (!handleAuthError(error)) return;
  }
};