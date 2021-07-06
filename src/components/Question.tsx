
import { ReactNode } from 'react';
import classNames from 'classnames';

import '../styles/question.scss';

interface QuestionProps {
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted?: boolean;
  isAnswered?: boolean;
  children: ReactNode;
}

export function Question({
  content,
  author,
  isHighlighted = false,
  isAnswered = false,
  children
}: QuestionProps) {
  return (
    <div
      className={classNames(
        'question',
        { answered: isAnswered },
        { highlighted: isHighlighted && !isAnswered }
      )}
    >
      <p>{ content }</p>

      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>

        <div>{ children }</div>
      </footer>
    </div>
  )
}
