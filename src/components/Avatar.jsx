import { initials, asset } from '../utils.js';
export default function Avatar({ user, className = '' }) {
  const style = user?.avatar ? { backgroundImage: `url('${asset(user.avatar)}')`, color: 'transparent' } : undefined;
  return <div className={'av ' + className} style={style}>{initials(user?.name)}</div>;
}
