import React from 'react';
import ReactDOM from 'react-dom';
// import './index.less';
import { Test } from './enumfile';

class Page extends React.Component {
  render() {
    const a: any = undefined ?? {};
    const c = a?.name?.abc ?? '';
    console.log(a, c, Test.测试);
    return <div className={'test'}>12312312</div>;
  }
}

ReactDOM.render(<Page />, document.getElementById('root'));
