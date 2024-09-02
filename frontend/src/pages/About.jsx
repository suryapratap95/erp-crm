import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'Idea to MVP'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.ideatomvp.ai">www.ideatomvp.ai</a>{' '}
          </p>
          <p>
            GitHub :{' '}
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://www.ideatomvp.ai`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
