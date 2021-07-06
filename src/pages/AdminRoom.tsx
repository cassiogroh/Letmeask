import { useHistory, useParams } from 'react-router-dom';

import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';
import { Question } from '../components/Question';
import { database } from '../services/firebase';

interface RoomParams {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);
  const history = useHistory();

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}/isAnswered`).get();

    const questionIsAnswered = questionRef.val();

    if (questionIsAnswered) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: false
      });
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true
      });
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = await database.ref(`rooms/${roomId}/questions/${questionId}/isHighlighted`).get();

    const questionIsHighlighted = questionRef.val();

    if (questionIsHighlighted) {
      database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false
      });
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true
      });
    }
  }

  function handleGoToHomePage() {
    history.push('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img
            src={logoImg}
            alt='Letmeask'
            onClick={handleGoToHomePage}
            title='Ir para página inicial'
          />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <div>
            <h1>Sala {title}</h1>
            { questions && <span>{questions.length} Pergunta(s)</span> }
          </div>
        </div>

        <div className="question-list">
          {
            questions.map(question => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <button
                  type='button'
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  title='Marcar pergunta como respondida'
                >
                  <img src={checkImg} alt='Marcar pergunta como respondida' />
                </button>

                <button
                  type='button'
                  onClick={() => handleHighlightQuestion(question.id)}
                  title='Dar destaque à pergunta'
                >
                  <img src={answerImg} alt='Dar destaque à pergunta' />
                </button>
                
                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                  title='Remover pergunta'
                >
                  <img src={deleteImg} alt='Remover pergunta' />
                </button>
              </Question>
            ))
          }
        </div>
      </main>
    </div>
  )
}
