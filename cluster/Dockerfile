FROM hal9ai/hal9-worker:0.2.17 as base

ENV PORT 3000

EXPOSE 3000

WORKDIR "/hal9/worker"

RUN ./hal9 --platform python new app1

CMD [ "./hal9", "--nobrowse", "--port", "3000", "--timeout", "0", "start", "app1" ]
