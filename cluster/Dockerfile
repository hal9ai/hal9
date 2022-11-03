FROM hal9ai/hal9-worker:0.2.0 as base

ENV PORT 3000

EXPOSE 3000

RUN hal9 --platform python new app1

CMD [ "hal9", "--nobrowse", "port", 3000, 'start', 'app1']
